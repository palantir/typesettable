/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { assert } from "chai";
import { Methods as utils } from "../src";

describe("Utils.Methods Test Suite", () => {
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
