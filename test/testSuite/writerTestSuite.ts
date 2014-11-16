///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Writer Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var writer: SVGTypewriter.Writers.Writer;
  var svg: D3.Selection;
  var writeOptions: SVGTypewriter.Writers.WriteOptions;
  var isHorizontal: boolean;

  var checkWriting = (text: string, width: number, height: number, checkTitle = false) => {
    svg.attr("width", width);
    svg.attr("height", height);
    writer.write(text, width, height, writeOptions);
    var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".text-area"));
    var dimensions = measurer.measure(
                      wrapper.wrap(text, measurer, isHorizontal ? width : height, isHorizontal ? height : width).wrappedText);

    assert.closeTo(bbox.width, dimensions.width, 1, "width should be almost the same");
    assert.closeTo(bbox.height, dimensions.height, 1, "height should be almost the same");

    assertBBoxInclusion(svg, svg.select(".text-area"));
    assert.equal(svg.select(".text-container").select("title").empty(), !checkTitle, "title was creatin accordingly");

    svg.remove();
  };

  beforeEach(() => {
    svg = generateSVG(200, 200);
    measurer = new SVGTypewriter.Measurers.Measurer(svg);
    wrapper = new SVGTypewriter.Wrappers.Wrapper();
    writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
    writeOptions = {
      selection: svg,
      xAlign: "left",
      yAlign: "top",
      textRotation: 0
    };
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
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
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
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("addTitleElement", () => {
      wrapper.maxLines(3);
      writer.addTitleElement(true);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, true);
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
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
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
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment corner", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "bottom";
      writeOptions.xAlign = "right";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writeOptions.xAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });
  });

  describe("Animator", () => {
    beforeEach(() => {
      writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator();
      isHorizontal = true;
    });

    it.skip("simple", () => {
      checkWriting("test", 200, 200);
    });
  });
});
