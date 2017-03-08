/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { assert } from "chai";
import { Cache } from "../src";

describe("Cache", () => {
  let callbackCalled = false;

  let cache: Cache<string>;

  beforeEach(() => {
    callbackCalled = false;
    cache = new Cache((s: string) => {
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
