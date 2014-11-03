///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Writer Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var writer: SVGTypewriter.Writers.Writer;
  var svg: D3.Selection;

  beforeEach(() => {
    svg = generateSVG(200, 200);
    var textSelection = svg.append("text");
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
    wrapper = new SVGTypewriter.Wrappers.Wrapper(measurer);
    writer = new SVGTypewriter.Writers.Writer(measurer);
  });

  describe("Core", () => {
    it("default text orientation", () => {
      assert.equal(writer.textOrientation(), "horizontal", "default text orientation is set correctly");
    });
    it("text orientation option", () => {
      writer.textOrientation("vertical");
      assert.equal(writer.textOrientation(), "vertical", "text orientation has been changed");
    });

    it("wrong text orientation option", () => {
      assert.throws(() => writer.textOrientation("hello"));
      assert.equal(writer.textOrientation(), "horizontal", "wrong option does not change writer state");
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
