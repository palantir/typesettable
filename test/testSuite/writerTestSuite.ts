///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Writer Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var writer: SVGTypewriter.Writers.Writer;
  var svg: D3.Selection;
  var writeOptions: SVGTypewriter.Writers.WriteOptions;

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
        textOrientation: "horizontal"
      };
    });

    it("one word", () => {
      var text = "test";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("multiple lines", () => {
      var text = "test\ntest";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("wrapping", () => {
      writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
    });
  });

  describe("Vertical left", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "bottom",
        yAlign: "left",
        textOrientation: "left"
      };
    });

    it("one word", () => {
      var text = "test";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("multiple lines", () => {
      var text = "test\ntest";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("wrapping", () => {
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("allignment right", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "right";
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });
  });

  describe("Vertical right", () => {
    beforeEach(() => {
      writeOptions = {
        selection: svg,
        xAlign: "bottom",
        yAlign: "left",
        textOrientation: "right"
      };
    });

    it("one word", () => {
      var text = "test";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("multiple lines", () => {
      var text = "test\ntest";
      writer.write(text, 200, 200, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(text);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("wrapping", () => {
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("allignment center", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.xAlign = "center";
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });

    it("allignment bottom", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.xAlign = "bottom";
      writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
