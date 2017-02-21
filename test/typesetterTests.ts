/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

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
            typesetter = Typesetter.svg(svg);
        });

        after(() => {
            svg.remove();
        });

        it("can write", () => {
            typesetter.write("test string goes here", 200, 100);
        });

        it("can clear cache", () => {
            typesetter.clearMeasurerCache();
        });
    });
});
