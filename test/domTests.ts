/// <reference types="mocha"/>
import { assert } from "chai";
import * as SVGTypewriter from "../src";
import { generateSVG } from "./utils";

describe("Utils.DOM Test Suite", () => {
  const domUtils = SVGTypewriter.Utils.DOM;
  it("getBBox works properly", () => {
    const svg = generateSVG();
    const expectedBox: { [key: string]: number } = {
      height: 20,
      width: 40,
      x: 0,
      y: 0,
    };
    const rect = svg.append("rect").attr(expectedBox);
    const measuredBox = domUtils.getBBox(rect);
    assert.deepEqual(measuredBox, expectedBox, "getBBox measures correctly");
    svg.remove();
  });

  it("getBBox does not fail on disconnected and display:none nodes", () => {
    const expectedBox: { [key: string]: number } = {
      height: 20,
      width: 40,
      x: 0,
      y: 0,
    };

    const removedSVG = generateSVG().remove();
    let rect = removedSVG.append("rect").attr(expectedBox);
    domUtils.getBBox(rect); // could throw NS_ERROR on FF

    const noneSVG = generateSVG().style("display", "none");
    rect = noneSVG.append("rect").attr(expectedBox);
    domUtils.getBBox(rect); // could throw NS_ERROR on FF

    noneSVG.remove();
  });
});
