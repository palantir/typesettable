///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Wrapper Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var svg: D3.Selection;

  before(() => {
    svg = generateSVG(200, 200);
    var textSelection = svg.append("text");
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
    wrapper = new SVGTypewriter.Wrappers.Wrapper(measurer);
  });

  it("time trimming option", () => {
    assert.doesNotThrow(() => wrapper.textTrimming("none"));
  });

  it("wring time trimming option", () => {
    assert.throws(() => wrapper.textTrimming("hello"));
  });

  after(() => {
    svg.remove();
  });
});
