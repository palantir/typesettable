/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

/// <reference types="mocha"/>
import * as d3 from "d3";
import * as SVGTypewriter from "../src";

import { assert } from "chai";

import { generateSVG } from "./utils";

describe("Measurer Test Suite", () => {
  let svg: d3.Selection<any>;
  let measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  describe("Text element", () => {
    let defaultText: string;
    let textSelection: d3.Selection<void>;
    beforeEach(() => {
      svg = generateSVG(200, 200);
      defaultText = "a\na";
      textSelection = svg.append("text");
      textSelection.text(defaultText);
      measurer = new SVGTypewriter.Measurers.Measurer(textSelection, null, true);
    });

    it("works on empty string", () => {
      const result = measurer.measure("");
      assert.deepEqual(result, {width: 0, height: 0}, "empty string has 0 width and height");
    });

    it("works on whitespaces", () => {
      const result = measurer.measure(" \t  ");
      assert.equal(result.width, 0, "whitespace has width 0");
      assert.equal(result.height, 0, "whitespace has height 0");
    });

    it.skip("works on whitespaces in middle", () => {
      const baseResult = measurer.measure("a a");
      const result = measurer.measure("a   a");
      assert.equal(result.width, baseResult.width, "multiple whitespaces occupy same space");
      assert.equal(result.height, baseResult.height, "height is the same");
    });

    it("works on multiple lines", () => {
      const baseResult = measurer.measure("a");
      const result = measurer.measure("a\na");
      assert.equal(result.width, baseResult.width, "width has not changed");
      assert.equal(result.height, baseResult.height * 2, "height has changed");
    });

    afterEach(() => {
      svg.remove();
    });
  });

  describe("Cache Character measurer", () => {
    beforeEach(() => {
      svg = generateSVG(200, 200);
      measurer = new SVGTypewriter.Measurers.CacheCharacterMeasurer(svg);
    });

    it("line", () => {
      const text = "helloworld";
      const dimensions = measurer.measure(text);
      const characterDimensions: SVGTypewriter.Measurers.IDimensions[] = text.split("").map((c) => measurer.measure(c));
      const dimensionsByCharacter = {
        height: d3.max(characterDimensions.map((c) => c.height)),
        width: d3.sum(characterDimensions.map((c) => c.width)),
      };

      assert.deepEqual(dimensions, dimensionsByCharacter, "text has been measured by characters.");
    });

    afterEach(() => {
      svg.remove();
    });
  });

  describe("Cache measurer", () => {
    beforeEach(() => {
      svg = generateSVG(200, 200);
      measurer = new SVGTypewriter.Measurers.CacheMeasurer(svg);
    });

    it("line", () => {
      const text = "helloworld";
      const dimensions = measurer.measure(text);
      const characterDimensions: SVGTypewriter.Measurers.IDimensions[] = text.split("").map((c) => measurer.measure(c));
      const dimensionsByCharacter = {
        height: d3.max(characterDimensions.map((c) => c.height)),
        width: d3.sum(characterDimensions.map((c) => c.width)),
      };

      assert.deepEqual(dimensions, dimensionsByCharacter, "text has been measured by characters.");
    });

    afterEach(() => {
      svg.remove();
    });
  });

  describe("DOM element", () => {
    before(() => {
      svg = generateSVG(200, 200);
      measurer = new SVGTypewriter.Measurers.Measurer(svg);
    });

    it("class is applied", () => {
      const className = "testClass";
      const measurerWithClass = new SVGTypewriter.Measurers.Measurer(svg, className);
      const originalMeasureBBox = (measurerWithClass as any).measureBBox;
      (measurerWithClass as any).measureBBox = (d: d3.Selection<void>, text: string) => {
          assert.isTrue(d.classed(className), "class has been applied to text element");
          return originalMeasureBBox(d, text);
      };
      measurer.measure();
    });

    it("works on empty string", () => {
      const result = measurer.measure("");
      assert.deepEqual(result, {width: 0, height: 0}, "empty string has 0 width and height");
    });

    it("works on whitespaces", () => {
      const result = measurer.measure(" \t  ");
      assert.equal(result.width, 0, "whitespace has width 0");
      assert.equal(result.height, 0, "whitespace has height 0");
    });

    it("works on multiple lines", () => {
      const baseResult = measurer.measure("a");
      const result = measurer.measure("a\na");
      assert.equal(result.width, baseResult.width, "width has not changed");
      assert.equal(result.height, baseResult.height * 2, "height has changed");
    });

    after(() => {
      svg.remove();
    });
  });
});
