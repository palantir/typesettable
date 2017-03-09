/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { assert } from "chai";
import * as sinon from "sinon";
import {
    CanvasContext,
    HtmlContext,
    HtmlUtils,
    IPen,
    ITypesetterContext,
    Measurer,
    SvgContext,
    SvgUtils,
    Wrapper,
    Writer,
} from "../src";

type WriteCallback = (text: string, options?: any, width?: number, height?: number) => void;

interface ITest {
    context?: ITypesetterContext<any>;
    pen: IMockPen;
    write?: WriteCallback;
}

interface IMockPen extends IPen {
    destroy: sinon.SinonSpy;
    write: sinon.SinonSpy;
}

function createWriteCallback(test: ITest) {
    const measurer = new Measurer(test.context);
    const wrapper = new Wrapper();
    const mockPenFactory = { createPen: () => test.pen };
    const writer = new Writer(measurer, mockPenFactory, wrapper);
    return (text: string, options = {}, width = 101, height = 100) => {
        writer.write(text, width, height, options);
    };
}

function commonTests(test: ITest) {
    it("can create measurers with ruler or ruler factory", () => {
        const m0 = new Measurer(test.context);
        const m1 = new Measurer(test.context);
        assert.deepEqual(m0.measure(TEXT), m1.measure(TEXT));
    });

    it("can create a pen", () => {
        const pen = test.context.createPen("", { translate: [0, 0], rotate: 0 });
        assert.isFunction(pen.write);
        assert.doesNotThrow(pen.write);
        if (pen.destroy != null) {
            assert.isFunction(pen.destroy);
            assert.doesNotThrow(pen.destroy);
        }
    });

    it("writes text", () => {
        test.write("test");
        assert.equal(test.pen.write.callCount, 1);
    });
}

const TEXT = "i am the very model of a modern major general";

const MAKE_TEST_SPIES = (): ITest => {
    return {
        pen: {
            destroy: sinon.spy(),
            write: sinon.spy(),
        },
    };
};

describe("Contexts", () => {
    const canvasTest = MAKE_TEST_SPIES();
    const svgTest = MAKE_TEST_SPIES();
    const htmlTest = MAKE_TEST_SPIES();
    let svg: SVGElement;
    let div: HTMLElement;

    before(() => {
        svg = SvgUtils.append(document.body, "svg");
        svg.setAttribute("style", "fill:blue;font:18px sans-serif;");
        svgTest.context = new SvgContext(svg);
        svgTest.write = createWriteCallback(svgTest);

        div = HtmlUtils.append(document.body, "div");
        div.style.font = "18px sans-serif";
        htmlTest.context = new HtmlContext(div);
        htmlTest.write = createWriteCallback(htmlTest);

        // hack to match line heights
        const lineHeight = new Measurer(svgTest.context.createRuler()).measure().height;

        const canvas = document.createElement("canvas");
        canvasTest.context = new CanvasContext(
            canvas.getContext("2d"),
            lineHeight,
            {
                fill: "red",
                font: "18px sans-serif",
                stroke: "red",
            },
        );
        canvasTest.write = createWriteCallback(canvasTest);
    });

    after(() => {
        document.body.removeChild(svg);
        document.body.removeChild(div);
    });

    beforeEach(() => {
        canvasTest.pen.write.reset();
        canvasTest.pen.destroy.reset();
        svgTest.pen.write.reset();
        svgTest.pen.destroy.reset();
        htmlTest.pen.write.reset();
        htmlTest.pen.destroy.reset();
    });

    commonTests(canvasTest);
    commonTests(svgTest);
    commonTests(htmlTest);

    it("wraps long text", () => {
        canvasTest.write(TEXT);
        svgTest.write(TEXT);
        htmlTest.write(TEXT);
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount, "calls canvas == svg");
        assert.equal(canvasTest.pen.write.callCount, htmlTest.pen.write.callCount, "calls canvas == html");
        assert.equal(
            canvasTest.pen.write.getCall(0).args[0],
            svgTest.pen.write.getCall(0).args[0],
            "args canvas == svg",
        );
        assert.equal(
            canvasTest.pen.write.getCall(0).args[0],
            htmlTest.pen.write.getCall(0).args[0],
            "args canvas == html",
        );
    });

    it("rotates text", () => {
        const options = { textRotation: 90 };
        // we use an additional pixel to handle multibrowser subpixel precision issues
        canvasTest.write(TEXT, options, 101, 51);
        svgTest.write(TEXT, options, 101, 51);
        htmlTest.write(TEXT, options, 101, 51);
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.callCount, htmlTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], svgTest.pen.write.getCall(0).args[0]);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], htmlTest.pen.write.getCall(0).args[0]);
    });

    it("shears text", () => {
        const options = { textShear: 45 };
        canvasTest.write(TEXT, options);
        svgTest.write(TEXT, options);
        htmlTest.write(TEXT, options);
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.callCount, htmlTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], svgTest.pen.write.getCall(0).args[0]);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], htmlTest.pen.write.getCall(0).args[0]);
    });
});
