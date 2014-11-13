///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Wrapper Test Suite", () => {
  var wrapper: SVGTypewriter.Wrappers.Wrapper;
  var measurer: SVGTypewriter.Measurers.AbstractMeasurer;
  var svg: D3.Selection;
  beforeEach(() => {
    svg = generateSVG(200, 200);
    var textSelection = svg.append("text");
    measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
    wrapper = new SVGTypewriter.Wrappers.Wrapper();
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
    var token: string;
    beforeEach(() => {
      token = "hello";
      wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      var dimensions = measurer.measure(token);
      var result = wrapper.wrap(token, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.deepEqual(result.wrappedText, token, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.deepEqual(result.noLines, 1, "no wrapping was needed");
    });

    it("one time wrapping", () => {
      var availableWidth = measurer.measure(token).width * 3 / 4;
      var result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.deepEqual(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

     it("no breaking words", () => {
      var availableWidth = measurer.measure(token).width * 3 / 4;
      wrapper.allowBreakingWords(false);
      var result = wrapper.wrap(token, measurer, availableWidth);
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("multi time wrapping", () => {
      var availableWidth = measurer.measure("h").width * 2;
      var result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.deepEqual(result.noBrokeWords, 2, "wrapping with breaking word twice");
      assert.deepEqual(result.noLines, 3, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      var availableWidth = measurer.measure("h").width - 0.1;
      var result = wrapper.wrap(token, measurer, availableWidth);
      assert.deepEqual(result.originalText, token, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible so no wrapping");
      assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("only first sign fits", () => {
      var tokenWithSmallFirstSign = "aHHH";
      var availableWidth = measurer.measure("a-").width;
      var result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign, "whole word has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "none word breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });
  });

  describe("One line wrapping", () => {
    var line: string;
    beforeEach(() => {
      line = "hello  world!.";
      wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      var dimensions = measurer.measure(line);
      var result = wrapper.wrap(line, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.deepEqual(result.wrappedText, line, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 1, "no wrapping was needed");
    });

     it("no breaking words", () => {
      var availableWidth = measurer.measure(line).width * 0.75;
      wrapper.allowBreakingWords(false);
      var result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "wrapping with breaking no word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("only token sign fits", () => {
      var tokenWithSmallFirstSign = "!HHH";
      var availableWidth = measurer.measure("!").width * 2;
      var result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, "!", "wrapping was possible");
      assert.deepEqual(result.truncatedText, "HHH", "big letters have been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("one time wrapping", () => {
      var availableWidth = measurer.measure(line).width * 0.75;
      var result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("multi time wrapping", () => {
      var availableWidth = measurer.measure("hell").width;
      var result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 5, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.closeTo(result.noBrokeWords, 3, 1, "wrapping with breaking two words about three times");
      assert.equal(result.noLines, 5, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("wrapping is impossible", () => {
      var availableWidth = measurer.measure("h").width - 0.1;
      var result = wrapper.wrap(line, measurer, availableWidth);
      assert.deepEqual(result.originalText, line, "original text has been set");
      assert.equal(result.wrappedText, "", "wrapping was impossible");
      assert.deepEqual(result.truncatedText, line, "whole text has been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
    });

    it("wrapping many whitespaces", () => {
      var lineWithWhitespaces = "hello              \t !!!";
      var availableWidth = measurer.measure("hello").width + 0.1;
      var result = wrapper.wrap(lineWithWhitespaces, measurer, availableWidth);
      assert.deepEqual(result.originalText, lineWithWhitespaces, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "one wrapping occured");
      assert.deepEqual(result.truncatedText, "", "whole text has fit in");
      assert.equal(result.noBrokeWords, 0, "no breaks");
      assert.equal(result.noLines, 2, "wrapped text has two lines");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("multiple line wrapping", () => {
    var lines: string;
    beforeEach(() => {
      lines = "hello  world!.\nhello  world!.";
      wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
    });

    it("does not wrap", () => {
      var dimensions = measurer.measure(lines);
      var result = wrapper.wrap(lines, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, lines, "original text has been set");
      assert.deepEqual(result.wrappedText, lines, "wrapped text is the same as original");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 2, "no wrapping was needed");
    });

    it("only token sign fits", () => {
      var tokenWithSmallFirstSign = "!HHH\n.";
      var availableWidth = measurer.measure("!-").width;
      var result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
      assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
      assert.equal(result.wrappedText, tokenWithSmallFirstSign.substring(0, 1), "wrapping was possible");
      assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign.substring(1), "big letters have been truncated");
      assert.deepEqual(result.noBrokeWords, 0, "no breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("one time wrapping", () => {
      var availableWidth = measurer.measure(lines).width * 0.75;
      var result = wrapper.wrap(lines, measurer, availableWidth);
      assert.deepEqual(result.originalText, lines, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 4, "wrapping occured");
      assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
      assert.equal(result.noBrokeWords, 2, "wrapping with breaking one word");
      assert.equal(result.noLines, 4, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("Max lines", () => {
    var text: string;
    beforeEach(() => {
      text = "hello  world!.\nhello  world!.";
      wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
    });

    it("no lines fits", () => {
      var dimensions = measurer.measure(text);
      wrapper.maxLines(0);
      var result = wrapper.wrap(text, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "", "wrapped text contains non characters");
      assert.deepEqual(result.truncatedText, text, "maxLines truncates both lines");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 0, "no lines fits");
    });

    it("does not wrap", () => {
      var lines = text.split("\n");
      var dimensions = measurer.measure(text);
      wrapper.maxLines(1);
      var result = wrapper.wrap(text, measurer, dimensions.width * 2);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, lines[0], "wrapped text contains first line");
      assert.deepEqual(result.truncatedText, lines[1], "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
      assert.equal(result.noLines, 1, "only first line fits");
    });

    it("one time wrapping", () => {
      var lines = text.split("\n");
      wrapper.maxLines(2);
      var availableWidth = measurer.measure(text).width * 0.75;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
      assert.deepEqual(result.truncatedText, lines[1], "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
      assert.equal(result.noLines, 2, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });

    it("in the middle of line", () => {
      var lines = text.split("\n");
      var availableWidth = measurer.measure(text).width * 0.75;
      wrapper.maxLines(3);
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
      assert.notEqual(result.truncatedText, "", "maxLines truncates second line");
      assert.equal(result.noBrokeWords, 2, "wrapping with breaking one word");
      assert.equal(result.noLines, 3, "wrapping was needed");
      assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
    });
  });

  describe("Ellipsis", () => {
    var text: string;
    beforeEach(() => {
      text = "hello";
      wrapper = new SVGTypewriter.Wrappers.Wrapper().maxLines(1);
    });

    it("single word", () => {
      var availableWidth = measurer.measure(text).width - 0.1;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.notEqual(result.wrappedText.indexOf("..."), -1, "ellipsis has been added");
      assert.deepEqual(result.noBrokeWords, 1, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("single token fits", () => {
      var text = "!HHH";
      var availableWidth = measurer.measure("!...").width;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "!...", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, "HHH", "only first sign fits");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("nothing fits", () => {
      var text = "!HHH";
      var availableWidth = measurer.measure("..").width;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "..", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, "!HHH", "whole word is truncated");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("handling whitespaces", () => {
      text = "this            aa";
      var availableWidth = measurer.measure(text).width - 1;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "this...", "whitespaces has been ommited");
      assert.deepEqual(result.truncatedText, "aa", "suffix has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "one break");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("ellipsis just fit", () => {
      var availableWidth = measurer.measure("h-").width;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.deepEqual(result.wrappedText, "...", "ellipsis has been added");
      assert.deepEqual(result.truncatedText, text, "text has been truncated");
      assert.deepEqual(result.noBrokeWords, 1, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });

    it("multiple token", () => {
      text = "hello world!";
      var availableWidth = measurer.measure("hello worl-").width;
      var result = wrapper.wrap(text, measurer, availableWidth);
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
      var availableWidth = measurer.measure(text).width;
      var result = wrapper.wrap(text, measurer, availableWidth);
      assert.deepEqual(result.originalText, text, "original text has been set");
      assert.operator(result.wrappedText.indexOf("..."), ">", 0, "ellipsis has been added");
      assert.deepEqual(result.wrappedText.substring(0, result.wrappedText.length - 3) + result.truncatedText,
                       text,
                       "non of letters disappeard");
      assert.deepEqual(result.noBrokeWords, 0, "one breaks");
      assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
    });
  });

  afterEach(() => {
    svg.remove();
  });
});
