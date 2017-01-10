/// <reference types="mocha"/>

import { assert } from "chai";
import * as SVGTypewriter from "../../src";
import { generateSVG } from "../utils";

describe("Animator Test Suite", () => {

  let writer: SVGTypewriter.Writers.Writer;
  let svg: d3.Selection<any>;
  let writeOptions: SVGTypewriter.Writers.IWriteOptions;

  const runAnimation = () => {
    writer.write("hello\nworld", 200, 200, writeOptions);
  };

  beforeEach(() => {
    svg = generateSVG(200, 200);
    const measurer = new SVGTypewriter.Measurers.Measurer(svg);
    const wrapper = new SVGTypewriter.Wrappers.Wrapper();
    writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
    writeOptions = {
      selection: svg,
      textRotation: 0,
      xAlign: "right",
      yAlign: "center",
    };
  });

  afterEach(() => {
    svg.remove();
  });

  describe("Base", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator();
    });

    it("defaults", () => {
      assert.equal(writeOptions.animator.duration(), 300, "duration is set to default");
      assert.equal(writeOptions.animator.delay(), 0, "delay is set to default");
      assert.equal(writeOptions.animator.easing(), "exp-out", "easing is set to default");
    });

    it("simple", () => {
      runAnimation();
    });

    it("duration", () => {
      writeOptions.animator.duration(6000);
      runAnimation();
    });
  });

  describe("Unveil", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.UnveilAnimator().duration(6000);
    });

    it("defaults", () => {
      assert.equal((writeOptions.animator as any).direction(), "bottom", "direction is set to default");
      assert.throws(() => (writeOptions.animator as any).direction("aaa"), Error);
      assert.equal((writeOptions.animator as any).direction(), "bottom", "direction is set to default");
    });

    it("direction - bottom", () => {
      runAnimation();
    });

    it("direction - top", () => {
      (writeOptions.animator as any).direction("top");
      runAnimation();
    });

    it("direction - left", () => {
      (writeOptions.animator as any).direction("left");
      runAnimation();
    });

    it("direction - right", () => {
      (writeOptions.animator as any).direction("right");
      runAnimation();
    });
  });

  describe("Opacity", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.OpacityAnimator().duration(6000);
    });

    it("simple", () => {
      runAnimation();
    });
  });

  describe("Moving X", () => {
    it("simple", () => {
      writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator().duration(6000).moveX(100);
      runAnimation();
    });

    it("opacity", () => {
      writeOptions.animator = new SVGTypewriter.Animators.OpacityAnimator().duration(6000).moveX(100);
      runAnimation();
    });

    it("unveil", () => {
      writeOptions.animator = new SVGTypewriter.Animators.UnveilAnimator().duration(6000).moveX(100);
      runAnimation();
    });
  });

  describe("Moving Y", () => {
    it("simple", () => {
      writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator().duration(6000).moveY(100);
      runAnimation();
    });

    it("opacity", () => {
      writeOptions.animator = new SVGTypewriter.Animators.OpacityAnimator().duration(6000).moveY(100);
      runAnimation();
    });

    it("unveil", () => {
      writeOptions.animator = new SVGTypewriter.Animators.UnveilAnimator().duration(6000).moveY(100);
      runAnimation();
    });
  });
});
