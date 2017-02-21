/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { assert } from "chai";
import {
    SvgUtils,
    Typesetter,
} from "../src";

describe("Typesetter", () => {
    describe("Canvas", () => {
        let typesetter: Typesetter;

        before(() => {
            const canvas = document.createElement("canvas");
            typesetter = Typesetter.canvas(canvas.getContext("2d"));
        });

        it("can write", () => {
            typesetter.write("test string goes here", 200, 100);
        });

        it("can clear cache", () => {
            typesetter.clearMeasurerCache();
        });
    });

    describe("SVG", () => {
        let svg: Element;
        let typesetter: Typesetter;

        before(() => {
            svg = SvgUtils.append(document.body, "svg");
            SvgUtils.append(svg, "g", "section-one");
            SvgUtils.append(svg, "g", "section-two");
            typesetter = Typesetter.svg(svg);
        });

        after(() => {
            svg.remove();
        });

        it("can write", () => {
            typesetter.write("test string goes here", 100, 100);
            assert.equal(svg.querySelector("text").textContent, "test string goes");
        });

        it("can write into separate containers", () => {
            typesetter.write("This string goes here", 100, 100, {}, svg.querySelector("g.section-one"));
            typesetter.write("Other string goes there", 100, 100, {}, svg.querySelector("g.section-two"));
            assert.equal(svg.querySelector("g.section-one text").textContent, "This string go-");
            assert.equal(svg.querySelector("g.section-two text").textContent, "Other string g-");
        });

        it("can clear cache", () => {
            typesetter.clearMeasurerCache();
        });
    });
});
