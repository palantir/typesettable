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

function contextBehaviorTests(test: ITest) {
    beforeEach(() => {
        test.pen.write.reset();
        test.pen.destroy.reset();
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

    it("wraps long text", () => {
        test.write("--- i am the very model of a modern major general");
        assert.equal(test.pen.write.callCount, 4);
        assert.equal(test.pen.write.getCall(3).args[0], "modern...");
    });

    it("rotates text", () => {
        const options = { textRotation: 90 };
        test.write("i am the very model of a modern major general", options, 100, 50);
        assert.equal(test.pen.write.callCount, 4);
        assert.equal(test.pen.write.getCall(3).args[0], "mo...");
    });

    it("shears text", () => {
        const options = { textShear: 45 };
        test.write("i am the very model of a modern major general", options);
        assert.equal(test.pen.write.callCount, 3);
        assert.equal(test.pen.write.getCall(1).args[0], "model of a");
    });
}

describe("Contexts", () => {
    describe("Canvas", () => {
        const test: ITest = {
            pen: {
                destroy: sinon.spy(),
                write: sinon.spy(),
            },
        };

        before(() => {
            const canvas = document.createElement("canvas");
            test.context = new CanvasContext(
                canvas.getContext("2d"),
                18 * CanvasContext.LINE_HEIGHT_FACTOR,
                {
                    fill: "red",
                    font: "18px sans-serif",
                    stroke: "red",
                },
            );
            test.write = createWriteCallback(test);
        });

        contextBehaviorTests(test);
    });

    describe("Svg", () => {
        const test: ITest = {
            pen: {
                destroy: sinon.spy(),
                write: sinon.spy(),
            },
        };
        let svg: Element;

        before(() => {
            svg = SvgUtils.append(document.body, "svg");
            svg.setAttribute("style", "fill:blue;font:18px sans-serif;");
            test.context = new SvgContext(svg);
            test.write = createWriteCallback(test);
        });

        after(() => {
            svg.remove();
        });

        contextBehaviorTests(test);
    });
});
