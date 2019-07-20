import { } from './../runtime/global';
import { View, Stack, Group } from "./view";
import { log } from 'util';

export function Link(context: any) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        const ret = class extends constructor {
            context = context
        }
        context.register(new ret)
        return ret
    }
}

export function NativeCall(target: Panel, propertyKey: string, descriptor: PropertyDescriptor) {
    const originVal = descriptor.value
    descriptor.value = function () {
        const args = []
        for (let index in arguments) {
            args.push(arguments[index]);
        }
        Reflect.apply(Reflect.get(target, '__hookBeforeNativeCall__'), this, [])
        const ret = Reflect.apply(originVal, this, args)
        Reflect.apply(Reflect.get(target, '__hookAfterNativeCall__'), this, [])
        return ret
    }
    return descriptor
}

type Frame = { width: number, height: number }

export abstract class Panel {

    onCreate() { }
    onDestory() { }
    onShow() { }
    onHidden() { }

    abstract build(rootView: Group): void

    private __data__: any
    private __rootView__: Group = new Stack

    getRootView() {
        return this.__rootView__
    }
    getInitData() {
        return this.__data__
    }

    @NativeCall
    private __init__(frame: Frame, data: any) {
        this.__data__ = data
        this.__rootView__.width = frame.width
        this.__rootView__.height = frame.height
        this.build(this.__rootView__)
    }

    @NativeCall
    private __onCreate__() {
        this.onCreate()
    }

    @NativeCall
    private __onDestory__() {
        this.onDestory()
    }

    @NativeCall
    private __onShow__() {
        this.onShow()
    }

    @NativeCall
    private __onHidden__(): void {
        this.onHidden()
    }

    @NativeCall
    private __build__() {
        this.build(this.__rootView__)
    }

    @NativeCall
    private __responedCallback__(viewId: string, callbackId: string) {

    }

    private __hookBeforeNativeCall__() {
        log('__hookBeforeNativeCall__')
    }

    private __hookAfterNativeCall__() {
        log('__hookAfterNativeCall__')
        if (this.__rootView__.isDirty()) {
            const model = this.__rootView__.toModel()
            log('needRefresh:' + JSON.stringify(model))
            this.__rootView__.clean()
        }
    }

}