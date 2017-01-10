import * as d3 from "d3";
import { assert } from "chai";

export function generateSVG(width = 400, height = 400): d3.Selection<any> {
  var parent = getSVGParent();
  return parent.append("svg").attr("width", width).attr("height", height).attr("class", "svg");
}

export function getSVGParent(): d3.Selection<any> {
  var mocha = d3.select("#mocha-report");
  if (mocha.node() != null) {
    var suites = mocha.selectAll(".suite");
    var lastSuite = d3.select(suites[0][suites[0].length - 1]);
    return lastSuite.selectAll("ul");
  } else {
    return d3.select("body");
  }
}

const Pixel_CloseTo_Requirement = 2;

export function assertBBoxInclusion(outerEl: d3.Selection<any>, innerEl: d3.Selection<any>) {
  var outerBox = (<Element> outerEl.node()).getBoundingClientRect();
  var innerBox = (<Element> innerEl.node()).getBoundingClientRect();
  assert.operator(Math.floor(outerBox.left), "<=", Math.ceil(innerBox.left) + Pixel_CloseTo_Requirement,
          "bounding rect left included");
  assert.operator(Math.floor(outerBox.top), "<=", Math.ceil(innerBox.top) + Pixel_CloseTo_Requirement,
          "bounding rect top included");
  assert.operator(Math.ceil(outerBox.right) + Pixel_CloseTo_Requirement, ">=", Math.floor(innerBox.right),
          "bounding rect right included");
  assert.operator(Math.ceil(outerBox.bottom) + Pixel_CloseTo_Requirement, ">=", Math.floor(innerBox.bottom),
          "bounding rect bottom included");
}
