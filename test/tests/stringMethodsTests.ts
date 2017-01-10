/// <reference types="mocha"/>
import { assert } from "chai";
import * as SVGTypewriter from "../../src";

describe("String Methods Test Suite", () => {
  const utils = SVGTypewriter.Utils.StringMethods;
  it("combine whitespaces works as expected", () => {
    assert.equal(utils.combineWhitespace("a"), "a", "combine whitespaces returns same single letter");
    assert.equal(utils.combineWhitespace("a "), "a ", "combine whitespaces returns same single letter with space");
    assert.equal(utils.combineWhitespace(" "), " ", "combine whitespaces returns same single space");
    assert.equal(utils.combineWhitespace("    "), " ", "combine whitespaces returns same single letter with sapce");
    assert.equal(utils.combineWhitespace("a    aa"), "a aa",
      "combine whitespaces returns words with single space between");
    assert.equal(utils.combineWhitespace("aa   \t   aa"), "aa aa",
      "combine whitespaces returns words with single space between");
  });

  it("trimStart works as expected", () => {
    assert.equal(utils.trimStart(""), "", "works on empty string");
    assert.equal(utils.trimStart("  "), "", "works on whitespace string");
    assert.equal(utils.trimStart("aa"), "aa", "works on non-whitespace string");
    assert.equal(utils.trimStart("a a"), "a a", "works on whitespace in the middle");
    assert.equal(utils.trimStart("a a   "), "a a   ", "works on whitespace at the end");
    assert.equal(utils.trimStart("  a a   "), "a a   ", "works on whitespace at both ends");
    assert.equal(utils.trimStart("aba", "b"), "aba", "works on special character in the middle");
    assert.equal(utils.trimStart("a abbb", "b"), "a abbb", "works on special character at the end");
    assert.equal(utils.trimStart("bbba ab   ", "b"), "a ab   ", "works on special character at both ends");
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
    assert.equal(utils.trimEnd("aba", "b"), "aba", "works on special character in the middle");
    assert.equal(utils.trimEnd("a abbb", "b"), "a a", "works on special character at the end");
    assert.equal(utils.trimEnd("   bbba ab", "b"), "   bbba a", "works on special character at both ends");
    assert.equal(utils.trimEnd(null), null, "works on null");
    assert.equal(utils.trimEnd(undefined), undefined, "works on undefined");
  });
});
