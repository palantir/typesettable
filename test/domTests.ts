/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { assert } from "chai";
import { DOM } from "../src";
import { generateSVG } from "./utils";

describe("Utils.DOM Test Suite", () => {

  it("getBBox works properly", () => {
    const svg = generateSVG();
    const expectedBox: { [key: string]: number } = {
      height: 20,
      width: 40,
      x: 0,
      y: 0,
    };
    const rect = svg.append("rect");
    DOM.applyAttrs(rect, expectedBox);
    const measuredBox = DOM.getBBox(rect);
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
    let rect = removedSVG.append("rect");
    DOM.applyAttrs(rect, expectedBox);
    DOM.getBBox(rect); // could throw NS_ERROR on FF

    const noneSVG = generateSVG().style("display", "none");
    rect = noneSVG.append("rect");
    DOM.applyAttrs(rect, expectedBox);
    DOM.getBBox(rect); // could throw NS_ERROR on FF

    noneSVG.remove();
  });

  it("transform works properly", () => {
    const svg = generateSVG();
    const translate = "translate(0, 0)";
    const rect = svg.append("rect");
    assert.equal(DOM.transform(rect), null);
    DOM.transform(rect, 0, 0);
    assert.equal(DOM.transform(rect), translate);
    svg.remove();
  });
});
