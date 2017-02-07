/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { assert } from "chai";

import {
  AbstractMeasurer,
  Measurer,
  SingleLineWrapper,
  Wrapper,
} from "../src";

import { AnySelection, generateSVG } from "./utils";

describe("Wrapper Test Suite", () => {
  let wrapper: Wrapper;
  let measurer: AbstractMeasurer;
  let svg: AnySelection;
  beforeEach(() => {
    svg = generateSVG(200, 200);
    svg.append("text");
    measurer = new Measurer(svg, null, true);
    wrapper = new Wrapper();
  });

  describe("Core", () => {
    it("default text trimming option", () => {
      assert.equal(wrapper.textTrimming(), "ellipsis", "default text trimming is set correctly");
    });

    it("text trimming option", () => {
      wrapper.textTrimming("none");
      assert.equal(wrapper.textTrimming(), "none", "text trimming is changed");
    });

    it("wrong text trimming option", () => {
      assert.throws(() => wrapper.textTrimming("hello"));
      assert.equal(wrapper.textTrimming(), "ellipsis", "wrong option does not modify wrapper");
    });

    it("max lines", () => {
      assert.equal(wrapper.maxLines(), Infinity, "max lines has been set to default");
      wrapper.maxLines(3);
      assert.equal(wrapper.maxLines(), 3, "max lines has been changed");
    });

    it("allow breaking words", () => {
      assert.isTrue(wrapper.allowBreakingWords(), "allow breaking words has been set to default");
    });
  });

  describe("One token wrapping", () => {
    let token: string;
    beforeEach(() => {
      token = "hello";
      wrapper = new Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      const dimensions = measurer.measure(token);
      const result = wrapper.wrap(token, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.deepEqual(result.wrappedText, token, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.deepEqual(result.noLines, 1, "no wrapping was needed");
    });

    it("does not wrap becasue of height", () => {
      const dimensions = measurer.measure(token);
      const result = wrapper.wrap(token, measurer, dimensions.width, dimensions.height / 2);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.deepEqual(result.wrappedText, "", "wrapped text is empty");
      assert.deepEqual(result.truncatedText, token, "whole word has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.deepEqual(result.noLines, 0, "no wrapping was needed");
    });

    it("one time wrapping", () => {
      const availableWidth = measurer.measure(token).width * 3 / 4;
      const result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.deepEqual(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("no breaking words", () => {
      const availableWidth = measurer.measure(token).width * 3 / 4;
      wrapper.allowBreakingWords(false);
      const result = wrapper.wrap(token, measurer, availableWidth);
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it.skip("multi time wrapping", () => {
      const availableWidth = measurer.measure("h-").width;
      const result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 2, "wrapping with breaking word");
      assert.deepEqual(result.noLines, 3, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      const availableWidth = measurer.measure("h").width - 0.1;
      const result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible so no wrapping");
      assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("only first sign fits", () => {
      const tokenWithSmallFirstSign = "aHHH";
      const availableWidth = measurer.measure("a-").width;
      const result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign, "whole word has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "none word breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });
  });

  describe("One line wrapping", () => {
    let line: string;
    beforeEach(() => {
      line = "hello  world!.";
      wrapper = new Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      const dimensions = measurer.measure(line);
      const result = wrapper.wrap(line, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.deepEqual(result.wrappedText, line, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 1, "no wrapping was needed");
    });

    it("no breaking words", () => {
      const availableWidth = measurer.measure(line).width * 0.75;
      wrapper.allowBreakingWords(false);
      const result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "wrapping with breaking no word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("only token sign fits", () => {
      const tokenWithSmallFirstSign = "!HHH";
      const availableWidth = measurer.measure("!").width * 2;
      const result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "!", "wrapping was possible");
      assert.deepEqual(result.truncatedText, "HHH", "big letters have been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("one time wrapping", () => {
      const availableWidth = measurer.measure(line).width * 0.75;
      const result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("whitespaces at the end", () => {
      line = "hello wor";
      const availableWidth = measurer.measure("hello").width;
      const result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.deepEqual(result.wrappedText, "hello\nwor", "only first word fits");
      assert.deepEqual(result.truncatedText, "", "whole line fits");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("multi time wrapping", () => {
      const availableWidth = measurer.measure("hell").width;
      const result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 5, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.closeTo(result.noBrokeWords, 3, 1, "wrapping with breaking two words about three times");
      assert.equal(result.noLines, 5, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      const availableWidth = measurer.measure("h").width - 0.1;
      const result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, line, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("wrapping many whitespaces", () => {
      const lineWithWhitespaces = "hello              \t !!!";
      const availableWidth = measurer.measure("hello !!!").width;
      const result = wrapper.wrap(lineWithWhitespaces, measurer, availableWidth);
      assert.deepEqual(result.originalText, lineWithWhitespaces, "original text has been set");
      assert.deepEqual(result.truncatedText, "", "whole text has fit in");
      assert.equal(result.noBrokeWords, 0, "no breaks");
      assert.equal(result.noLines, 1, "wrapped text has two lines");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("multiple line wrapping", () => {
    let lines: string;
    beforeEach(() => {
      lines = "hello  world!.\nhello  world!.";
      wrapper = new Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      const dimensions = measurer.measure(lines);
      const result = wrapper.wrap(lines, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, lines, "original text has been set");
      assert.deepEqual(result.wrappedText, lines, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 2, "no wrapping was needed");
    });

    it("only token sign fits", () => {
      const tokenWithSmallFirstSign = "!HHH\n.";
      const availableWidth = measurer.measure("!-").width;
      const result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, tokenWithSmallFirstSign.substring(0, 1), "wrapping was possible");
      assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign.substring(1), "big letters have been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("one time wrapping", () => {
      const availableWidth = measurer.measure(lines).width * 0.75;
      const result = wrapper.wrap(lines, measurer, availableWidth);
      assert.deepEqual(result.originalText, lines, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 4, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 2, "wrapping with breaking one word");
      assert.equal(result.noLines, 4, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("Max lines", () => {
    let text: string;
    beforeEach(() => {
      text = "hello  world!.\nhello  world!.";
      wrapper = new Wrapper().textTrimming("none");
    });

    it("no lines fits", () => {
      const dimensions = measurer.measure(text);
      wrapper.maxLines(0);
      const result = wrapper.wrap(text, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "", "wrapped text contains non characters");
      assert.deepEqual(result.truncatedText, text, "maxLines truncates both lines");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 0, "no lines fits");
    });

    it("does not wrap", () => {
      const lines = text.split("\n");
      const dimensions = measurer.measure(text);
      wrapper.maxLines(1);
      const result = wrapper.wrap(text, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, lines[0], "wrapped text contains first line");
      assert.deepEqual(result.truncatedText, lines[1], "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 1, "only first line fits");
    });

    it("one time wrapping", () => {
      const lines = text.split("\n");
      wrapper.maxLines(2);
      const availableWidth = measurer.measure(text).width * 0.75;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, lines[1], "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("in the middle of line", () => {
      const availableWidth = measurer.measure(text).width * 0.75;
      wrapper.maxLines(3);
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
      assert.notEqual(result.truncatedText, "", "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 2, "wrapping with breaking one word");
      assert.equal(result.noLines, 3, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("Ellipsis", () => {
    let text: string;
    beforeEach(() => {
      text = "hello";
      wrapper = new Wrapper().maxLines(1);
    });

    it("single word", () => {
      const availableWidth = measurer.measure(text).width - 0.1;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.notEqual(result.wrappedText.indexOf("..."), -1, "ellipsis has been added");
      assert.deepEqual(result.noBrokeWords, 1, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    // Failing firefox linux
    xit("single token fits", () => {
      text = "!HHH";
      const availableWidth = measurer.measure("!...").width;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "!...", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, "HHH", "only first sign fits");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("nothing fits", () => {
      text = "!HHH";
      const availableWidth = measurer.measure("...").width;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "...", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, "!HHH", "whole word is truncated");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("handling whitespaces", () => {
      text = "this            aa";
      const availableWidth = measurer.measure(text).width - 1;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "this...", "whitespaces has been ommited");
      assert.deepEqual(result.truncatedText, "aa", "suffix has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "one break");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("ellipsis just fit", () => {
      const availableWidth = measurer.measure("h-").width;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "...", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, text, "text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("multiple token", () => {
      text = "hello world!";
      const availableWidth = measurer.measure("hello worl-").width;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.operator(result.wrappedText.indexOf("..."), ">", 0, "ellipsis has been added");
      assert.deepEqual(result.wrappedText.substring(0, result.wrappedText.length - 3) + result.truncatedText,
                       text,
                       "non of letters disappeard");
      assert.deepEqual(result.noBrokeWords, 1, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("multiple lines", () => {
      text = "hello  world!.\nhello  world!.";
      const availableWidth = measurer.measure(text).width;
      const result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.operator(result.wrappedText.indexOf("..."), ">", 0, "ellipsis has been added");
      assert.deepEqual(result.wrappedText.substring(0, result.wrappedText.length - 3) + result.truncatedText,
                       text,
                       "non of letters disappeard");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });
  });

  describe("Single Line wrapper", () => {
    beforeEach(() => {
      wrapper = new SingleLineWrapper().maxLines(2);
    });

    it("simple", () => {
      const text = "hello.";
      const availableWidth = measurer.measure(text).width;
      const baseWrapper = new Wrapper().maxLines(2);
      const result = wrapper.wrap(text, measurer, availableWidth);
      const baseResult = baseWrapper.wrap(text, measurer, availableWidth);
      const baseDimensions = measurer.measure(baseResult.wrappedText);
      const dimensions = measurer.measure(result.wrappedText);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.equal(result.wrappedText, text, "wrapped text is not the whole line");
      assert.equal(result.wrappedText, baseResult.wrappedText, "wrapped text looks better");
      assert.equal(dimensions.width, baseDimensions.width, "occupies same width");
      assert.equal(dimensions.height, baseDimensions.height, "occupies same height");
      assert.operator(dimensions.width, "<=", availableWidth, "wrapped text fits in");
    });

    it("two lines", () => {
      const text = "hello  world!.";
      const availableWidth = measurer.measure(text).width - 2;
      const baseWrapper = new Wrapper().maxLines(2);
      const result = wrapper.wrap(text, measurer, availableWidth);
      const baseResult = baseWrapper.wrap(text, measurer, availableWidth);
      const baseDimensions = measurer.measure(baseResult.wrappedText);
      const dimensions = measurer.measure(result.wrappedText);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.notEqual(result.wrappedText, text, "wrapped text is not the whole line");
      assert.notEqual(result.wrappedText, baseResult.wrappedText, "wrapped text looks better");
      assert.operator(dimensions.width, "<", baseDimensions.width, "occupies less width");
      assert.equal(dimensions.height, baseDimensions.height, "occupies same height");
      assert.operator(dimensions.width, "<=", availableWidth, "wrapped text fits in");
    });

    it("only one line", () => {
      const text = "hello  world!.\naa";
      const availableWidth = measurer.measure(text).width - 2;
      assert.throws(() => wrapper.wrap(text, measurer, availableWidth),
        "SingleLineWrapper is designed to work only on single line");
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
