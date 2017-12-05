/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { assert } from "chai";
import { Tokenizer } from "../src";

describe("Tokenizer Test Suite", () => {
  let tokenizer: Tokenizer;

  before(() => {
    tokenizer = new Tokenizer();
  });

  it("single word", () => {
    const singleWord = "hello";
    const tokens = tokenizer.tokenize(singleWord);
    assert.deepEqual(tokens, [singleWord], "Single word string is one token");
  });

  it("multiple words", () => {
    const multipleWords = ["hello", " ", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multi words string has many tokens");
  });

  it("mutliple whitespaces", () => {
    const multipleWords = ["hello", "    ", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multiple whitespaces are one token");
  });

  it("word divider", () => {
    const multipleWords = ["hello,", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Word divider is not a separate token");
  });

  it("word divider + whitespace", () => {
    const multipleWords = ["hello,", " ", "world", " "];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Word divider are same token but whitespace are separate");
  });

  it("mutliple word divider", () => {
    const multipleWords = ["hello,,", " ", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Mutliple same word dividers are the same token");
  });

  it("different word dividers", () => {
    const multipleWords = ["hello,", ";", " ", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Different word dividers are the same token");
  });

  it("all whitespaces are same token", () => {
    const multipleWords = ["hello", " \t ", "world"];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multiple different whitespaces are the same token");
  });

  it("whitespaces at the end", () => {
    const multipleWords = ["hello", "  "];
    const tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Whitespaces at the end are separate token");
  });
});
