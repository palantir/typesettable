/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
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
            typesetter.write("test string", 200, 100);
        });

        it("can clear cache", () => {
            typesetter.clearMeasurerCache();
        });
    });

    describe("SVG", () => {
        let svg: SVGElement;
        let typesetter: Typesetter;

        before(() => {
            svg = SvgUtils.append(document.body, "svg");
            SvgUtils.append(svg, "g", "section-one");
            SvgUtils.append(svg, "g", "section-two");
            typesetter = Typesetter.svg(svg);
        });

        after(() => {
            document.body.removeChild(svg);
        });

        it("can write", () => {
            typesetter.write("test string", 200, 100);
            assert.equal(svg.querySelector("text").textContent, "test string");
        });

        it("can write into separate containers", () => {
            typesetter.write("This string goes here", 100, 100, {}, svg.querySelector("g.section-one"));
            typesetter.write("Other string goes there", 100, 100, {}, svg.querySelector("g.section-two"));
            assert.equal(svg.querySelector("g.section-one text").textContent.substr(0, 4), "This");
            assert.equal(svg.querySelector("g.section-two text").textContent.substr(0, 5), "Other");
        });

        it("can clear cache", () => {
            typesetter.clearMeasurerCache();
        });
    });
});
