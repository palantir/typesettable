/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { CanvasContext, ICanvasFontStyle, ITypesetterContext, HtmlContext, SvgContext } from "./contexts";
import { CacheMeasurer } from "./measurers";
import { Wrapper } from "./wrappers";
import { IWriteOptions, Writer } from "./writers";

/**
 * This is a convenience interface for typesetting strings using the default
 * measurer/wrapper/writer setup.
 */
export class Typesetter {
    public static svg(element: SVGElement, className?: string, addTitleElement?: boolean) {
        return new Typesetter(new SvgContext(element, className, addTitleElement));
    }

    public static canvas(ctx: CanvasRenderingContext2D, lineHeight?: number, style?: ICanvasFontStyle) {
        return new Typesetter(new CanvasContext(ctx, lineHeight, style));
    }

    public static html(element: HTMLElement, className?: string, addTitle?: boolean) {
        return new Typesetter(new HtmlContext(element, className, addTitle));
    }

    public measurer: CacheMeasurer;
    public wrapper: Wrapper;
    public writer: Writer;

    constructor(private context: ITypesetterContext<any>) {
        this.measurer = new CacheMeasurer(this.context);
        this.wrapper = new Wrapper();
        this.writer = new Writer(this.measurer, this.context, this.wrapper);
    }

    /**
     * Wraps the given string into the width/height and writes it into the
     * canvas or SVG (depending on context).
     *
     * Delegates to `Writer.write` using the internal `ITypesetterContext`.
     */
    public write(text: string, width: number, height: number, options?: IWriteOptions, into?: any) {
        this.writer.write(text, width, height, options, into);
    }

    /**
     * Clears the `Measurer`'s CacheMeasurer.
     *
     * Call this if your font style changee in SVG.
     */
    public clearMeasurerCache() {
        this.measurer.reset();
    }
}
