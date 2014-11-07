///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Measurer Test Suite", () => {
  var svg: D3.Selection;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var defaultText: string;
  var textSelection: D3.Selection;

  before(() => {
    svg = generateSVG(200, 200);
    defaultText = "a\na";
    textSelection = svg.append("text");
    textSelection.text(defaultText);
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
  });

  it("resets default string", () => {
    measurer.measure("hello world");
    assert.deepEqual(textSelection.text(), defaultText, "Text inside selection has been reseted to default");
  });

  it("works on empty string", () => {
    var result = measurer.measure("");
    assert.deepEqual(result, {width: 0, height: 0}, "empty string has 0 width and height");
  });

  it("works on whitespace", () => {
    var result = measurer.measure(" ");
    assert.operator(result.width, ">", 0, "whitespace has width greater than 0");
    assert.operator(result.height, ">", 0, "whitespace has height greater than 0");
  });

  it("works on multiple whitespaces", () => {
    var baseResult = measurer.measure(" ");
    var result = measurer.measure("   ");
    assert.equal(result.width, baseResult.width, "width has no changed");
    assert.equal(result.height, baseResult.height, "height has not changed");
  });

  it("works on multiple lines", () => {
    var baseResult = measurer.measure("a");
    var result = measurer.measure("a\na");
    assert.equal(result.width, baseResult.width, "width has not changed");
    assert.equal(result.height, baseResult.height * 2, "height has changed");
  });

  after(() => {
    svg.remove();
  });
});
