/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { assert } from "chai";

import {
  AbstractMeasurer,
  IWriteOptions,
  Measurer,
  SvgContext,
  SvgUtils,
  Wrapper,
  Writer,
} from "../src";

import { assertBBoxInclusion, d3Selection, generateSVG } from "./utils";

describe("Writer Test Suite", () => {
  let context: SvgContext;
  let isHorizontal: boolean;
  let measurer: AbstractMeasurer;
  let svg: d3Selection<any>;
  let wrapper: Wrapper;
  let writeOptions: IWriteOptions;
  let writer: Writer;

  const checkWriting = (text: string, width: number, height: number, shouldHaveTitle = false) => {
    svg.attr("width", width);
    svg.attr("height", height);
    writer.write(text, width, height, writeOptions);
    const bbox = SvgUtils.getDimensions(svg.select(".text-area").node() as any as SVGLocatable);
    const dimensions = measurer.measure(
                      wrapper.wrap(
                        text,
                        measurer,
                        isHorizontal ? width : height,
                        isHorizontal ? height : width,
                      ).wrappedText);

    assert.closeTo(bbox.width, dimensions.width, 1,
      "width of the text should be almost the same as measurer width");
    assert.closeTo(bbox.height, dimensions.height, 1,
      "height of the text should be almost the same as measurer height");

    assertBBoxInclusion(svg, svg.select(".text-area"));
    assert.equal(svg.select(".text-container").select("title").empty(),
                 !shouldHaveTitle,
                 "title element was created according to writer options");

    svg.remove();
  };

  beforeEach(() => {
    svg = generateSVG(200, 200);
    context = new SvgContext(svg.node());
    measurer = new Measurer(context.createRuler());
    wrapper = new Wrapper();
    writer = new Writer(measurer, wrapper);
    writeOptions = {
      context,
      textRotation: 0,
      xAlign: "right",
      yAlign: "center",
    };
  });

  describe("Core", () => {
    it("unsupported text rotation", () => {
      (writeOptions as any).textRotation = 45;
      assert.throws(() => checkWriting("test", 200, 200), Error);
      svg.remove();
    });
  });

  describe("Horizontal", () => {
    beforeEach(() => {
      writeOptions.textRotation = 0;
      isHorizontal = true;
    });

    it("one word", () => {
      checkWriting("test", 200, 200);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200);
    });

    it("wrapping", () => {
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });
  });

  describe("Horizontal flipside", () => {
    beforeEach(() => {
      writeOptions.textRotation = 180;
      isHorizontal = true;
    });

    it("one word", () => {
      checkWriting("test", 200, 200);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200);
    });

    it("wrapping", () => {
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("addTitleElement", () => {
      wrapper.maxLines(3);
      context.setAddTitleElement(true);
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150, true);
    });
  });

  describe("Vertical left", () => {
    beforeEach(() => {
      writeOptions.textRotation = -90;
      isHorizontal = false;
    });

    it("one word", () => {
      checkWriting("test", 200, 200);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200);
    });

    it("wrapping", () => {
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });
  });

  describe("Vertical right", () => {
    beforeEach(() => {
      writeOptions.textRotation = 90;
      isHorizontal = false;
    });

    it("one word", () => {
      checkWriting("test", 200, 200);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200);
    });

    it("wrapping", () => {
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsepntencewithmanycharacters", 50, 150);
    });
  });
});
