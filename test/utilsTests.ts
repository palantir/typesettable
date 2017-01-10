/// <reference types="mocha"/>
import { assert } from "chai";
import * as SVGTypewriter from "../src";

describe("Utils.Methods Test Suite", () => {
  const utils = SVGTypewriter.Utils.Methods;

  it("objEq works as expected", () => {
    assert.isTrue(utils.objEq({}, {}));
    assert.isTrue(utils.objEq(null, null));
    assert.isFalse(utils.objEq(null, "null"));
    assert.isTrue(utils.arrayEq(null, null));
    assert.isFalse(utils.arrayEq(null, [null]));
    assert.isFalse(utils.arrayEq([1], [null]));
    assert.isTrue(utils.objEq({a: 5}, {a: 5}));
    assert.isFalse(utils.objEq({a: 5, b: 6}, {a: 5}));
    assert.isFalse(utils.objEq({a: 5}, {a: 5, b: 6}));
    assert.isTrue(utils.objEq({a: "hello"}, {a: "hello"}));
    assert.isFalse(utils.objEq({constructor: {}.constructor}, {}), "using \"constructor\" isn't hidden");
  });
});
