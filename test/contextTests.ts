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
import { defaults } from "./utils";

type WriteCallback = (text: string, options?: any, width?: number, height?: number) => void;

function createWriteCallback(test: ITest) {
    const measurer = new Measurer(test.context.createRuler());
    const wrapper = new Wrapper();
    const writer = new Writer(measurer, wrapper);
    const mockContext = { context: { createPen: () => test.pen } };
    return (text: string, options = {}, width = 100, height = 100) => {
        writer.write(text, width, height, defaults({}, options, mockContext));
    };
}

function contextBehaviorTests(test: ITest) {
    beforeEach(() => {
        test.pen.reset();
    });

    it("can create a pen", () => {
        const pen = test.context.createPen("", { translate: [0, 0], rotate: 0 });
        assert.isFunction(pen);
        assert.doesNotThrow(pen);
        if (test.context.destroyPen != null) {
            assert.doesNotThrow(() => {
                test.context.destroyPen(pen);
            });
        }
    });

    it("writes text", () => {
        test.write("test");
        assert.equal(test.pen.callCount, 1);
    });

    it("long text is wrapped", () => {
        test.write("--- i am the very model of a modern major general");
        assert.equal(test.pen.callCount, 4);
        assert.equal(test.pen.getCall(3).args[0], "modern...");
    });

    it("text rotation", () => {
        const options = { textRotation: 90 };
        test.write("i am the very model of a modern major general", options, 100, 50);
        assert.equal(test.pen.callCount, 4);
        assert.equal(test.pen.getCall(3).args[0], "mo...");
    });

    it("text shearing", () => {
        const options = { textShear: 45 };
        test.write("i am the very model of a modern major general", options);
        assert.equal(test.pen.callCount, 3);
        assert.equal(test.pen.getCall(1).args[0], "model of a");
    });
}

interface ITest {
    pen: IPen & sinon.SinonSpy;
    context?: ITypesetterContext;
    write?: WriteCallback;
}

describe("Contexts", () => {
    describe("Canvas", () => {
        const test: ITest = {
            pen: sinon.spy(),
        };

        before(() => {
            const canvas = document.createElement("canvas");
            test.context = new CanvasContext(canvas.getContext("2d"), 21.1875, {
                fill: "red",
                font: "18px sans-serif",
                stroke: "red",
            });
            test.write = createWriteCallback(test);
        });

        contextBehaviorTests(test);
    });

    describe("Svg", () => {
        const test: ITest = {
            pen: sinon.spy(),
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
