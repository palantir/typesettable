///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Utils.DOM Test Suite", () => {
  var domUtils = SVGTypewriter.Utils.DOM;
  it("getBBox works properly", () => {
    var svg = generateSVG();
    var expectedBox: { [key: string]: number } = {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
    };
    var rect = svg.append("rect").attr(expectedBox);
    var measuredBox = domUtils.getBBox(rect);
    assert.deepEqual(measuredBox, expectedBox, "getBBox measures correctly");
    svg.remove();
  });

  it("getBBox does not fail on disconnected and display:none nodes", () => {
    var expectedBox: { [key: string]: number } = {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
    };

    var removedSVG = generateSVG().remove();
    var rect = removedSVG.append("rect").attr(expectedBox);
    domUtils.getBBox(rect); // could throw NS_ERROR on FF

    var noneSVG = generateSVG().style("display", "none");
    rect = noneSVG.append("rect").attr(expectedBox);
    domUtils.getBBox(rect); // could throw NS_ERROR on FF

    noneSVG.remove();
  });
});
