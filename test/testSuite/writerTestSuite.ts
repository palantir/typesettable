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
    var textSelection = svg.append("text");
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
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
      writer.write("test", 200, 200, writeOptions);
    });

    it("multiple lines", () => {
      writer.write("test\ntest", 200, 200, writeOptions);
    });

    it("wrapping", () => {
      writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
