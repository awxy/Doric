export var LayoutSpec;
(function (LayoutSpec) {
    /**
     * Depends on what's been set on width or height.
    */
    LayoutSpec[LayoutSpec["JUST"] = 0] = "JUST";
    /**
     * Depends on it's content.
     */
    LayoutSpec[LayoutSpec["FIT"] = 1] = "FIT";
    /**
     * Extend as much as parent let it take.
     */
    LayoutSpec[LayoutSpec["MOST"] = 2] = "MOST";
})(LayoutSpec || (LayoutSpec = {}));
export class LayoutConfigImpl {
    fit() {
        this.widthSpec = LayoutSpec.FIT;
        this.heightSpec = LayoutSpec.FIT;
        return this;
    }
    most() {
        this.widthSpec = LayoutSpec.MOST;
        this.heightSpec = LayoutSpec.MOST;
        return this;
    }
    just() {
        this.widthSpec = LayoutSpec.JUST;
        this.heightSpec = LayoutSpec.JUST;
        return this;
    }
    configWidth(w) {
        this.widthSpec = w;
        return this;
    }
    configHeight(h) {
        this.heightSpec = h;
        return this;
    }
    configMargin(m) {
        this.margin = m;
        return this;
    }
    configAlignment(a) {
        this.alignment = a;
        return this;
    }
    configWeight(w) {
        this.weight = w;
        return this;
    }
    toModel() {
        return {
            widthSpec: this.widthSpec,
            heightSpec: this.heightSpec,
            margin: this.margin,
            alignment: this.alignment ? this.alignment.toModel() : undefined,
            weight: this.weight,
        };
    }
}
export function layoutConfig() {
    return new LayoutConfigImpl;
}