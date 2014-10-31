///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Wrapper Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var svg: D3.Selection;
  before(() => {
    svg = generateSVG(200, 200);
    var textSelection = svg.append("text");
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
    wrapper = new SVGTypewriter.Wrappers.Wrapper(measurer);
  });

  describe("Core", () => {
    it("time trimming option", () => {
      assert.doesNotThrow(() => wrapper.textTrimming("none"));
    });

    it("wrong time trimming option", () => {
      assert.throws(() => wrapper.textTrimming("hello"));
    });
  });

  describe("One token wrapping", () => {
    var token: string;
    before(() => {
      token = "hello";
    });

    it("does not wrap", () => {
      var dimensions = measurer.measure(token);
      var result = wrapper.wrap(token, dimensions.width * 2);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.deepEqual(result.wrappedText, token, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.deepEqual(result.noLines, 1, "no wrapping was needed");
    });

    it("one time wrapping", () => {
      var availableWidth = measurer.measure(token).width * 3 / 4;
      var result = wrapper.wrap(token, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.deepEqual(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("multi time wrapping", () => {
      var availableWidth = measurer.measure("h").width * 2;
      var result = wrapper.wrap(token, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.deepEqual(result.noLines, 3, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      var availableWidth = measurer.measure("h").width - 0.1;
      var result = wrapper.wrap(token, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("only first sign fits", () => {
      var tokenWithSmallFirstSign = "aHHH";
      var availableWidth = measurer.measure("a-").width;
      var result = wrapper.wrap(tokenWithSmallFirstSign, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });
  });

  describe("One line wrapping", () => {
    var line: string;
    before(() => {
      line = "hello  world!.";
    });

    it("does not wrap", () => {
      var dimensions = measurer.measure(line);
      var result = wrapper.wrap(line, dimensions.width * 2);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.deepEqual(result.wrappedText, line, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 1, "no wrapping was needed");
    });

    it("only token sign fits", () => {
      var tokenWithSmallFirstSign = "!HHH";
      var availableWidth = measurer.measure("!-").width;
      var result = wrapper.wrap(tokenWithSmallFirstSign, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "!", "wrapping was possible");
      assert.deepEqual(result.truncatedText, "HHH", "big letters have been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("one time wrapping", () => {
      var availableWidth = measurer.measure(line).width * 3 / 4;
      var result = wrapper.wrap(line, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("multi time wrapping", () => {
      var availableWidth = measurer.measure("hell").width;
      var result = wrapper.wrap(line, availableWidth);
      //assert.isTrue(false, result.wrappedText);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 5, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 2, "wrapping with breaking two words");
      assert.equal(result.noLines, 5, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      var availableWidth = measurer.measure("h").width - 0.1;
      var result = wrapper.wrap(line, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, line, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("wrapping many whitespaces", () => {
      var lineWithWhitespaces = "hello              \t !!!";
      var availableWidth = measurer.measure("hello").width + 0.1;
      var result = wrapper.wrap(lineWithWhitespaces, availableWidth);
      assert.deepEqual(result.originalText, lineWithWhitespaces, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "one wrapping occured");
      assert.deepEqual(result.truncatedText, "", "whole text has fit in");
      assert.equal(result.noBrokeWords, 0, "no breaks");
      assert.equal(result.noLines, 2, "wrapped text has two lines");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  after(() => {
    svg.remove();
  });
});
