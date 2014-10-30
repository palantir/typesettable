///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Tokenizer Test Suite", () => {
  var tokenizer: SVGTypewriter.Utils.Tokenizer;

  before(() => {
    tokenizer = new SVGTypewriter.Utils.Tokenizer();
  });

  it("single word", () => {
    var singleWord = "hello";
    var tokens = tokenizer.tokenize(singleWord);
    assert.deepEqual(tokens, [singleWord], "Single word string is one token");
  });

  it("multiple words", () => {
    var multipleWords = ["hello", " ", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multi words string has many tokens");
  });

  it("mutliple whitespaces", () => {
    var multipleWords = ["hello", "    ", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multiple whitespaces are one token");
  });

  it("word divider", () => {
    var multipleWords = ["hello", ",", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Word divider is separate token");
  });

  it("word divider + whitespace", () => {
    var multipleWords = ["hello", ",", "world", " "];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Word divider and whitespace are separate tokens");
  });

  it("mutliple word divider", () => {
    var multipleWords = ["hello", ",,", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Mutliple same word dividers are the same token");
  });

  it("different word dividers", () => {
    var multipleWords = ["hello", ",", ";", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Different word dividers are not the same token");
  });

  it("all whitespaces are same token", () => {
    var multipleWords = ["hello", " \t ", "world"];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Multiple different whitespaces are the same token");
  });

  it("whitespaces at the end", () => {
    var multipleWords = ["hello", "  "];
    var tokens = tokenizer.tokenize(multipleWords.join(""));
    assert.deepEqual(tokens, multipleWords, "Whitespaces at the end are separate token");
  });
});
