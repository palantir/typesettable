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

  it("time trimming option", () => {
    assert.doesNotThrow(() => wrapper.textTrimming("none"));
  });

  it("wrong time trimming option", () => {
    assert.throws(() => wrapper.textTrimming("hello"));
  });

  it("does not wrap short sentence", () => {
    var shortSentence = "hello";
    var dimensions = measurer.measure(shortSentence);
    var result = wrapper.wrap(shortSentence, dimensions.width * 2);
    assert.deepEqual(result.originalText, shortSentence, "original text has been set");
    assert.deepEqual(result.wrappedText, shortSentence, "wrapped text is the same as original");
    assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
    assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
    assert.deepEqual(result.noLines, 1, "no wrapping was needed");
  });

  it("one time wrapping is correct", () => {
    var shortSentence = "hello";
    var dimensions = measurer.measure(shortSentence);
    var result = wrapper.wrap(shortSentence, dimensions.width * 3 / 4);
    assert.deepEqual(result.originalText, shortSentence, "original text has been set");
    assert.notEqual(result.wrappedText.indexOf("\n"), - 1, "wrapping occured");
    assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
    assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
    assert.deepEqual(result.noLines, 2, "wrapping was needed");
  });

  after(() => {
    svg.remove();
  });
});
