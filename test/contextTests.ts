/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { assert } from "chai";
import * as sinon from "sinon";
import {
    CanvasContext,
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
    const measurer = new Measurer(test.context.createRuler());
    const wrapper = new Wrapper();
    const mockPenFactory = { createPen: () => test.pen };
    const writer = new Writer(measurer, mockPenFactory, wrapper);
    return (text: string, options = {}, width = 100, height = 100) => {
        writer.write(text, width, height, options);
    };
}

function commonTests(test: ITest) {
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

describe("Contexts", () => {
    const canvasTest: ITest = {
        pen: {
            destroy: sinon.spy(),
            write: sinon.spy(),
        },
    };
    const svgTest: ITest = {
        pen: {
            destroy: sinon.spy(),
            write: sinon.spy(),
        },
    };
    let svg: Element;

    before(() => {
        svg = SvgUtils.append(document.body, "svg");
        svg.setAttribute("style", "fill:blue;font:18px sans-serif;");
        svgTest.context = new SvgContext(svg);
        svgTest.write = createWriteCallback(svgTest);

        const canvas = document.createElement("canvas");
        canvasTest.context = new CanvasContext(
            canvas.getContext("2d"),
            18 * CanvasContext.LINE_HEIGHT_FACTOR,
            {
                fill: "red",
                font: "18px sans-serif",
                stroke: "red",
            },
        );
        canvasTest.write = createWriteCallback(canvasTest);
    });

    after(() => {
        svg.remove();
    });

    beforeEach(() => {
        canvasTest.pen.write.reset();
        canvasTest.pen.destroy.reset();
        svgTest.pen.write.reset();
        svgTest.pen.destroy.reset();
    });

    commonTests(canvasTest);
    commonTests(svgTest);

    it("wraps long text", () => {
        canvasTest.write("--- i am the very model of a modern major general");
        svgTest.write("--- i am the very model of a modern major general");
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], svgTest.pen.write.getCall(0).args[0]);
    });

    it("rotates text", () => {
        const options = { textRotation: 90 };
        canvasTest.write("i am the very model of a modern major general", options, 100, 50);
        svgTest.write("i am the very model of a modern major general", options, 100, 50);
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], svgTest.pen.write.getCall(0).args[0]);
    });

    it("shears text", () => {
        const options = { textShear: 45 };
        canvasTest.write("i am the very model of a modern major general", options);
        svgTest.write("i am the very model of a modern major general", options);
        assert.equal(canvasTest.pen.write.callCount, svgTest.pen.write.callCount);
        assert.equal(canvasTest.pen.write.getCall(0).args[0], svgTest.pen.write.getCall(0).args[0]);
    });
});
