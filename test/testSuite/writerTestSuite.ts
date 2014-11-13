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
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 50, 150).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 50, 150).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 50, 150).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 50, 150).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
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
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
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
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines", () => {
      wrapper.maxLines(3);
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("maxLines + no ellipsis", () => {
      wrapper.maxLines(3).textTrimming("none");
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });

    it("allignment", () => {
      wrapper.maxLines(3).textTrimming("none");
      writeOptions.yAlign = "center";
      var text = "reallylongsentencewithmanycharacters";
      writer.write(text, 50, 150, writeOptions);
      var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".textArea"));
      var dimensions = measurer.measure(wrapper.wrap(text, measurer, 150, 50).wrappedText);
      assert.closeTo(dimensions.width, bbox.width, 0.05, "width should be the same");
      assert.closeTo(dimensions.height, bbox.height, 0.05, "height should be the same");
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
