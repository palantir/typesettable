/// <reference types="mocha"/>
import { assert } from "chai";
import * as SVGTypewriter from "../../src";

describe("Cache", () => {
  var callbackCalled = false;

  var cache: SVGTypewriter.Utils.Cache<string>;

  beforeEach(() => {
    callbackCalled = false;
    cache = new SVGTypewriter.Utils.Cache((s: string) => {
      callbackCalled = true;
      return s;
    });
  });

  it("Doesn't call its function if it already called", () => {
    cache.get("s");
    assert.isTrue(callbackCalled, "cache did not found value");
    callbackCalled = false;
    cache.get("s");
    assert.isFalse(callbackCalled, "cache has stored previous value");
  });

  it("Clears its cache when .clear() is called", () => {
    cache.get("s");
    assert.isTrue(callbackCalled, "cache did not found value");
    callbackCalled = false;
    cache.clear();
    cache.get("s");
    assert.isTrue(callbackCalled, "cache has been cleared");
  });
});
