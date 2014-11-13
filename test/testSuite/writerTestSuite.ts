///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Writer Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var writer: SVGTypewriter.Writers.Writer;
  var svg: D3.Selection;
  var writeOptions: SVGTypewriter.Writers.WriteOptions;

  var checkWriting = (text: string, width: number, height: number, isHorizontal = true) => {
    writer.write(text, width, height, writeOptions);
    var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
    var dimensions = measurer.measure(
                      wrapper.wrap(text, measurer, isHorizontal ? width : height, isHorizontal ? height : width).wrappedText);

    assert.closeTo(bbox.width, dimensions.width, 0.05, "width should be the same");
    assert.closeTo(bbox.height, dimensions.height, 0.05, "height should be the same");
    svg.remove();
  };

  beforeEach(() => {
    svg = generateSVG(200, 200);
    measurer = new SVGTypewriter.Measurers.Measurer(svg);
    wrapper = new SVGTypewriter.Wrappers.Wrapper();
    writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
  });

  describe("Horizontal", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "left",
        yAlign: "top",
        textRotation: 0
      };
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

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });
  });

  describe("Horizontal flipside", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "left",
        yAlign: "top",
        textRotation: 180
      };
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

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150);
    });
  });

  describe("Vertical left", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "left",
        yAlign: "top",
        textRotation: -90
      };
    });

    it("one word", () => {
      checkWriting("test", 200, 200, false);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200, false);
    });

    it("wrapping", () => {
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150, false);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });
  });

  describe("Vertical right", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "left",
        yAlign: "top",
        textRotation: 90
      };
    });

    it("one word", () => {
      checkWriting("test", 200, 200, false);
    });

    it("multiple lines", () => {
      checkWriting("test\ntest", 200, 200, false);
    });

    it("wrapping", () => {
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("whitespaces", () => {
      checkWriting("a    a", 50, 150, false);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      checkWriting("reallylongsentencewithmanycharacters", 50, 150, false);
    });
  });
});
