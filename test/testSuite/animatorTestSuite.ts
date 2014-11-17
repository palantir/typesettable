///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Animator Test Suite", () => {
  var writer: SVGTypewriter.Writers.Writer;
  var svg: D3.Selection;
  var writeOptions: SVGTypewriter.Writers.WriteOptions;

  var checkWriting = () => {
    writer.write("hello\nworld", 200, 200, writeOptions);
    svg.remove();
  };

  beforeEach(() => {
    svg = generateSVG(200, 200);
    var measurer = new SVGTypewriter.Measurers.Measurer(svg);
    var wrapper = new SVGTypewriter.Wrappers.Wrapper();
    writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
    writeOptions = {
      selection: svg,
      xAlign: "left",
      yAlign: "top",
      textRotation: 0
    };
  });
  describe("Base", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator();
    });

    it("defaults", () => {
      assert.equal(writeOptions.animator.duration(), 300, "duration is set to default");
      assert.equal(writeOptions.animator.delay(), 0, "delay is set to default");
      assert.equal(writeOptions.animator.easing(), "exp-out", "easing is set to default");
      svg.remove();
    });

    it("simple", () => {
      checkWriting();
    });

    it("duration", () => {
      writeOptions.animator.duration(6000);
      checkWriting();
    });
  });

  describe("Unveil", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.UnveilAnimator().duration(6000);
    });

    it("defaults", () => {
      assert.equal((<any>writeOptions.animator).direction(), "bottom", "direction is set to default");
      assert.throws(() => (<any>writeOptions.animator).direction("aaa"), Error);
      assert.equal((<any>writeOptions.animator).direction(), "bottom", "direction is set to default");
      svg.remove();
    });

    it("direction - bottom", () => {
      checkWriting();
    });

    it("direction - top", () => {
      (<any>writeOptions.animator).direction("top");
      checkWriting();
    });

    it("direction - left", () => {
      (<any>writeOptions.animator).direction("left");
      checkWriting();
    });

    it("direction - right", () => {
      (<any>writeOptions.animator).direction("right");
      checkWriting();
    });
  });

  describe("Opacity", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.OpacityAnimator().duration(6000);
    });

    it("simple", () => {
      checkWriting();
    });
  });
});
