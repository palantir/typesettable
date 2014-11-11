///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Utils.Methods Test Suite", () => {
  var utils = SVGTypewriter.Utils.Methods;
  it("objEq works as expected", () => {
    assert.isTrue(utils.objEq({}, {}));
    assert.isTrue(utils.objEq({a: 5}, {a: 5}));
    assert.isFalse(utils.objEq({a: 5, b: 6}, {a: 5}));
    assert.isFalse(utils.objEq({a: 5}, {a: 5, b: 6}));
    assert.isTrue(utils.objEq({a: "hello"}, {a: "hello"}));
    assert.isFalse(utils.objEq({constructor: {}.constructor}, {}), "using \"constructor\" isn't hidden");
  });

  it("trimStart works as expected", () => {
    assert.equal(utils.trimStart(""), "", "works on empty string");
    assert.equal(utils.trimStart("  "), "", "works on whitespace string");
    assert.equal(utils.trimStart("aa"), "aa", "works on non-whitespace string");
    assert.equal(utils.trimStart("a a"), "a a", "works on whitespace in the middle");
    assert.equal(utils.trimStart("a a   "), "a a   ", "works on whitespace at the end");
    assert.equal(utils.trimStart(" \t a a   "), "a a   ", "works on whitespace at both ends");
    assert.equal(utils.trimStart(null), null, "works on null");
    assert.equal(utils.trimStart(undefined), undefined, "works on undefined");
  });

  it("trimEnd works as expected", () => {
    assert.equal(utils.trimEnd(""), "", "works on empty string");
    assert.equal(utils.trimEnd("  "), "", "works on whitespace string");
    assert.equal(utils.trimEnd("aa"), "aa", "works on non-whitespace string");
    assert.equal(utils.trimEnd("a a"), "a a", "works on whitespace in the middle");
    assert.equal(utils.trimEnd("a a   "), "a a", "works on whitespace at the end");
    assert.equal(utils.trimEnd(" \t a a   "), " \t a a", "works on whitespace at both ends");
    assert.equal(utils.trimEnd(null), null, "works on null");
    assert.equal(utils.trimEnd(undefined), undefined, "works on undefined");
  });
});
