/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Color, GradientColor } from "../util/color"
import { Modeling, Model, obj2Model } from "../util/types";
import { uniqueId } from "../util/uniqueId";
import { Gravity } from "../util/gravity";
import { loge } from "../util/log";

export enum LayoutSpec {
    EXACTLY = 0,
    WRAP_CONTENT = 1,
    AT_MOST = 2,
}

export interface LayoutConfig {
    widthSpec?: LayoutSpec
    heightSpec?: LayoutSpec
    margin?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    alignment?: Gravity
}

export function Property(target: Object, propKey: string) {
    Reflect.defineMetadata(propKey, true, target)
}

export interface IView {
    width?: number
    height?: number
    bgColor?: Color | GradientColor
    corners?: number | { leftTop?: number; rightTop?: number; leftBottom?: number; rightBottom?: number }
    border?: { width: number; color: Color; }
    shadow?: { color: Color; opacity: number; radius: number; offsetX: number; offsetY: number }
    alpha?: number
    hidden?: boolean
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }
    layoutConfig?: LayoutConfig
    onClick?: Function
    identifier?: string
}


export abstract class View implements Modeling, IView {
    @Property
    width: number = 0

    @Property
    height: number = 0

    @Property
    x: number = 0

    @Property
    y: number = 0

    @Property
    bgColor?: Color | GradientColor

    @Property
    corners?: number | { leftTop?: number; rightTop?: number; leftBottom?: number; rightBottom?: number }

    @Property
    border?: { width: number; color: Color; }

    @Property
    shadow?: { color: Color; opacity: number; radius: number; offsetX: number; offsetY: number }

    @Property
    alpha?: number

    @Property
    hidden?: boolean

    @Property
    viewId = uniqueId('ViewId')

    @Property
    padding?: {
        left?: number,
        right?: number,
        top?: number,
        bottom?: number,
    }

    @Property
    layoutConfig?: LayoutConfig

    @Property
    onClick?: Function

    superview?: Superview

    callbacks: Map<String, Function> = new Map

    private callback2Id(f: Function) {
        const id = uniqueId('Function')
        this.callbacks.set(id, f)
        return id
    }

    private id2Callback(id: string) {
        let f = this.callbacks.get(id)
        if (f === undefined) {
            f = Reflect.get(this, id) as Function
        }
        return f
    }

    constructor() {
        return new Proxy(this, {
            get: (target, p, receiver) => {
                return Reflect.get(target, p, receiver)
            },
            set: (target, p, v, receiver) => {
                const oldV = Reflect.get(target, p, receiver)
                const ret = Reflect.set(target, p, v, receiver)
                if (Reflect.getMetadata(p, target) && oldV !== v) {
                    receiver.onPropertyChanged(p.toString(), oldV, v)
                }
                return ret
            }
        })
    }
    /** Anchor start*/
    get left() {
        return this.x
    }
    set left(v: number) {
        this.x = v
    }

    get right() {
        return this.x + this.width
    }
    set right(v: number) {
        this.x = v - this.width
    }

    get top() {
        return this.y
    }

    set top(v: number) {
        this.y = v
    }

    get bottom() {
        return this.y + this.height
    }

    set bottom(v: number) {
        this.y = v - this.height
    }

    get centerX() {
        return this.x + this.width / 2
    }

    get centerY() {
        return this.y + this.height / 2
    }

    set centerX(v: number) {
        this.x = v - this.width / 2
    }

    set centerY(v: number) {
        this.y = v - this.height / 2
    }
    /** Anchor end*/

    private __dirty_props__: { [index: string]: Model | undefined } = {}

    get dirtyProps() {
        return this.__dirty_props__
    }

    nativeViewModel = {
        id: this.viewId,
        type: this.constructor.name,
        props: this.__dirty_props__,
    }

    onPropertyChanged(propKey: string, oldV: Model, newV: Model): void {
        if (newV instanceof Function) {
            newV = this.callback2Id(newV)
        } else {
            newV = obj2Model(newV)
        }
        this.__dirty_props__[propKey] = newV
    }

    clean() {
        for (const key in this.__dirty_props__) {
            if (Reflect.has(this.__dirty_props__, key)) {
                Reflect.deleteProperty(this.__dirty_props__, key)
            }
        }
    }

    isDirty() {
        return Reflect.ownKeys(this.__dirty_props__).length !== 0
    }

    responseCallback(id: string, ...args: any) {
        const f = this.id2Callback(id)
        if (f instanceof Function) {
            const argumentsList: any = []
            for (let i = 1; i < arguments.length; i++) {
                argumentsList.push(arguments[i])
            }
            return Reflect.apply(f, this, argumentsList)
        } else {
            loge(`Cannot find callback:${id} for ${JSON.stringify(this.toModel())}`)
        }
    }

    toModel() {
        return this.nativeViewModel
    }

    let(block: (it: this) => void) {
        block(this)
    }

    also(block: (it: this) => void) {
        block(this)
        return this
    }

    in(group: Group) {
        group.addChild(this)
    }
}

export abstract class Superview extends View {
    subviewById(id: string): View | undefined {
        for (let v of this.allSubviews()) {
            if (v.viewId === id) {
                return v
            }
        }
    }
    abstract allSubviews(): Iterable<View>

    isDirty() {
        if (super.isDirty()) {
            return true
        } else {
            for (const v of this.allSubviews()) {
                if (v.isDirty()) {
                    return true
                }
            }
        }
        return false
    }

    clean() {
        for (let v of this.allSubviews()) {
            v.clean()
        }
        super.clean()
    }

    toModel() {
        const subviews = []
        for (let v of this.allSubviews()) {
            if (v.isDirty()) {
                subviews.push(v.toModel())
            }
        }
        this.dirtyProps.subviews = subviews
        return super.toModel()
    }
}

export abstract class Group extends Superview {

    readonly children: View[] = new Proxy([], {
        set: (target, index, value) => {
            const ret = Reflect.set(target, index, value)
            // Let getDirty return true
            this.dirtyProps.children = this.children.map(e => e.viewId)
            return ret
        }
    })

    allSubviews() {
        return this.children
    }

    addChild(view: View) {
        this.children.push(view)
    }
}

