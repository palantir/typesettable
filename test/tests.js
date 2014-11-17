///<reference path="testReference.ts" />
function generateSVG(width, height) {
    if (width === void 0) { width = 400; }
    if (height === void 0) { height = 400; }
    var parent = getSVGParent();
    return parent.append("svg").attr("width", width).attr("height", height).attr("class", "svg");
}
function getSVGParent() {
    var mocha = d3.select("#mocha-report");
    if (mocha.node() != null) {
        var suites = mocha.selectAll(".suite");
        var lastSuite = d3.select(suites[0][suites[0].length - 1]);
        return lastSuite.selectAll("ul");
    }
    else {
        return d3.select("body");
    }
}
function assertBBoxInclusion(outerEl, innerEl) {
    var outerBox = outerEl.node().getBoundingClientRect();
    var innerBox = innerEl.node().getBoundingClientRect();
    assert.operator(Math.floor(outerBox.left), "<=", Math.ceil(innerBox.left) + window.Pixel_CloseTo_Requirement, "bounding rect left included");
    assert.operator(Math.floor(outerBox.top), "<=", Math.ceil(innerBox.top) + window.Pixel_CloseTo_Requirement, "bounding rect top included");
    assert.operator(Math.ceil(outerBox.right) + window.Pixel_CloseTo_Requirement, ">=", Math.floor(innerBox.right), "bounding rect right included");
    assert.operator(Math.ceil(outerBox.bottom) + window.Pixel_CloseTo_Requirement, ">=", Math.floor(innerBox.bottom), "bounding rect bottom included");
}

///<reference path="testReference.ts" />
before(function () {
    // Taken from https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    if (window.PHANTOMJS) {
        window.Pixel_CloseTo_Requirement = 2;
    }
    else if (isFirefox) {
        window.Pixel_CloseTo_Requirement = 1;
    }
    else {
        window.Pixel_CloseTo_Requirement = 0.5;
    }
});
after(function () {
    var parent = getSVGParent();
    var mocha = d3.select("#mocha-report");
    if (mocha.node() != null) {
        var suites = mocha.selectAll(".suite");
        for (var i = 0; i < suites[0].length; i++) {
            var curSuite = d3.select(suites[0][i]);
            assert(curSuite.selectAll("ul").selectAll("svg").node() === null, "all svgs have been removed");
        }
    }
    else {
        assert(d3.select("body").selectAll("svg").node() === null, "all svgs have been removed");
    }
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Cache", function () {
    var callbackCalled = false;
    var cache;
    beforeEach(function () {
        callbackCalled = false;
        cache = new SVGTypewriter.Utils.Cache(function (s) {
            callbackCalled = true;
            return s;
        });
    });
    it("Doesn't call its function if it already called", function () {
        cache.get("s");
        assert.isTrue(callbackCalled, "cache did not found value");
        callbackCalled = false;
        cache.get("s");
        assert.isFalse(callbackCalled, "cache has stored previous value");
    });
    it("Clears its cache when .clear() is called", function () {
        cache.get("s");
        assert.isTrue(callbackCalled, "cache did not found value");
        callbackCalled = false;
        cache.clear();
        cache.get("s");
        assert.isTrue(callbackCalled, "cache has been cleared");
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Utils.DOM Test Suite", function () {
    var domUtils = SVGTypewriter.Utils.DOM;
    it("getBBox works properly", function () {
        var svg = generateSVG();
        var expectedBox = {
            x: 0,
            y: 0,
            width: 40,
            height: 20
        };
        var rect = svg.append("rect").attr(expectedBox);
        var measuredBox = domUtils.getBBox(rect);
        assert.deepEqual(measuredBox, expectedBox, "getBBox measures correctly");
        svg.remove();
    });
    it("getBBox does not fail on disconnected and display:none nodes", function () {
        var expectedBox = {
            x: 0,
            y: 0,
            width: 40,
            height: 20
        };
        var removedSVG = generateSVG().remove();
        var rect = removedSVG.append("rect").attr(expectedBox);
        domUtils.getBBox(rect); // could throw NS_ERROR on FF
        var noneSVG = generateSVG().style("display", "none");
        rect = noneSVG.append("rect").attr(expectedBox);
        domUtils.getBBox(rect); // could throw NS_ERROR on FF
        noneSVG.remove();
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Utils.Methods Test Suite", function () {
    var utils = SVGTypewriter.Utils.Methods;
    it("objEq works as expected", function () {
        assert.isTrue(utils.objEq({}, {}));
        assert.isTrue(utils.objEq(null, null));
        assert.isFalse(utils.objEq(null, "null"));
        assert.isTrue(utils.arrayEq(null, null));
        assert.isFalse(utils.arrayEq(null, [null]));
        assert.isFalse(utils.arrayEq([1], [null]));
        assert.isTrue(utils.objEq({ a: 5 }, { a: 5 }));
        assert.isFalse(utils.objEq({ a: 5, b: 6 }, { a: 5 }));
        assert.isFalse(utils.objEq({ a: 5 }, { a: 5, b: 6 }));
        assert.isTrue(utils.objEq({ a: "hello" }, { a: "hello" }));
        assert.isFalse(utils.objEq({ constructor: {}.constructor }, {}), "using \"constructor\" isn't hidden");
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Tokenizer Test Suite", function () {
    var tokenizer;
    before(function () {
        tokenizer = new SVGTypewriter.Utils.Tokenizer();
    });
    it("single word", function () {
        var singleWord = "hello";
        var tokens = tokenizer.tokenize(singleWord);
        assert.deepEqual(tokens, [singleWord], "Single word string is one token");
    });
    it("multiple words", function () {
        var multipleWords = ["hello", " ", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Multi words string has many tokens");
    });
    it("mutliple whitespaces", function () {
        var multipleWords = ["hello", "    ", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Multiple whitespaces are one token");
    });
    it("word divider", function () {
        var multipleWords = ["hello", ",", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Word divider is separate token");
    });
    it("word divider + whitespace", function () {
        var multipleWords = ["hello", ",", "world", " "];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Word divider and whitespace are separate tokens");
    });
    it("mutliple word divider", function () {
        var multipleWords = ["hello", ",,", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Mutliple same word dividers are the same token");
    });
    it("different word dividers", function () {
        var multipleWords = ["hello", ",", ";", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Different word dividers are not the same token");
    });
    it("all whitespaces are same token", function () {
        var multipleWords = ["hello", " \t ", "world"];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Multiple different whitespaces are the same token");
    });
    it("whitespaces at the end", function () {
        var multipleWords = ["hello", "  "];
        var tokens = tokenizer.tokenize(multipleWords.join(""));
        assert.deepEqual(tokens, multipleWords, "Whitespaces at the end are separate token");
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Wrapper Test Suite", function () {
    var wrapper;
    var measurer;
    var svg;
    beforeEach(function () {
        svg = generateSVG(200, 200);
        var textSelection = svg.append("text");
        measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
        wrapper = new SVGTypewriter.Wrappers.Wrapper();
    });
    describe("Core", function () {
        it("default text trimming option", function () {
            assert.equal(wrapper.textTrimming(), "ellipsis", "default text trimming is set correctly");
        });
        it("text trimming option", function () {
            wrapper.textTrimming("none");
            assert.equal(wrapper.textTrimming(), "none", "text trimming is changed");
        });
        it("wrong text trimming option", function () {
            assert.throws(function () { return wrapper.textTrimming("hello"); });
            assert.equal(wrapper.textTrimming(), "ellipsis", "wrong option does not modify wrapper");
        });
        it("max lines", function () {
            assert.equal(wrapper.maxLines(), Infinity, "max lines has been set to default");
            wrapper.maxLines(3);
            assert.equal(wrapper.maxLines(), 3, "max lines has been changed");
        });
        it("allow breaking words", function () {
            assert.isTrue(wrapper.allowBreakingWords(), "allow breaking words has been set to default");
        });
    });
    describe("One token wrapping", function () {
        var token;
        beforeEach(function () {
            token = "hello";
            wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
        });
        it("does not wrap", function () {
            var dimensions = measurer.measure(token);
            var result = wrapper.wrap(token, measurer, dimensions.width * 2);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.deepEqual(result.wrappedText, token, "wrapped text is the same as original");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.deepEqual(result.noLines, 1, "no wrapping was needed");
        });
        it("one time wrapping", function () {
            var availableWidth = measurer.measure(token).width * 3 / 4;
            var result = wrapper.wrap(token, measurer, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
            assert.deepEqual(result.noLines, 2, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("no breaking words", function () {
            var availableWidth = measurer.measure(token).width * 3 / 4;
            wrapper.allowBreakingWords(false);
            var result = wrapper.wrap(token, measurer, availableWidth);
            assert.equal(result.wrappedText, "", "wrapping was impossible");
            assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
        });
        it("multi time wrapping", function () {
            var availableWidth = measurer.measure("h").width * 2;
            var result = wrapper.wrap(token, measurer, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 2, "wrapping with breaking word twice");
            assert.deepEqual(result.noLines, 3, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("wrapping is impossible", function () {
            var availableWidth = measurer.measure("h").width - 0.1;
            var result = wrapper.wrap(token, measurer, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.equal(result.wrappedText, "", "wrapping was impossible so no wrapping");
            assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
        });
        it("only first sign fits", function () {
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
    describe("One line wrapping", function () {
        var line;
        beforeEach(function () {
            line = "hello  world!.";
            wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
        });
        it("does not wrap", function () {
            var dimensions = measurer.measure(line);
            var result = wrapper.wrap(line, measurer, dimensions.width * 2);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.deepEqual(result.wrappedText, line, "wrapped text is the same as original");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.equal(result.noLines, 1, "no wrapping was needed");
        });
        it("no breaking words", function () {
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
        it("only token sign fits", function () {
            var tokenWithSmallFirstSign = "!HHH";
            var availableWidth = measurer.measure("!").width * 2;
            var result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
            assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
            assert.equal(result.wrappedText, "!", "wrapping was possible");
            assert.deepEqual(result.truncatedText, "HHH", "big letters have been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("one time wrapping", function () {
            var availableWidth = measurer.measure(line).width * 0.75;
            var result = wrapper.wrap(line, measurer, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
            assert.equal(result.noLines, 2, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("whitespaces at the end", function () {
            var line = "hello wor";
            var availableWidth = measurer.measure("hello").width;
            var result = wrapper.wrap(line, measurer, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.deepEqual(result.wrappedText, "hello\nwor", "only first word fits");
            assert.deepEqual(result.truncatedText, "", "whole line fits");
            assert.equal(result.noLines, 2, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("multi time wrapping", function () {
            var availableWidth = measurer.measure("hell").width;
            var result = wrapper.wrap(line, measurer, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 5, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.closeTo(result.noBrokeWords, 3, 1, "wrapping with breaking two words about three times");
            assert.equal(result.noLines, 5, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("wrapping is impossible", function () {
            var availableWidth = measurer.measure("h").width - 0.1;
            var result = wrapper.wrap(line, measurer, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.equal(result.wrappedText, "", "wrapping was impossible");
            assert.deepEqual(result.truncatedText, line, "whole text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
        });
        it("wrapping many whitespaces", function () {
            var lineWithWhitespaces = "hello              \t !!!";
            var availableWidth = measurer.measure("hello !!!").width;
            var result = wrapper.wrap(lineWithWhitespaces, measurer, availableWidth);
            assert.deepEqual(result.originalText, lineWithWhitespaces, "original text has been set");
            assert.deepEqual(result.truncatedText, "", "whole text has fit in");
            assert.equal(result.noBrokeWords, 0, "no breaks");
            assert.equal(result.noLines, 1, "wrapped text has two lines");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
    });
    describe("multiple line wrapping", function () {
        var lines;
        beforeEach(function () {
            lines = "hello  world!.\nhello  world!.";
            wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
        });
        it("does not wrap", function () {
            var dimensions = measurer.measure(lines);
            var result = wrapper.wrap(lines, measurer, dimensions.width * 2);
            assert.deepEqual(result.originalText, lines, "original text has been set");
            assert.deepEqual(result.wrappedText, lines, "wrapped text is the same as original");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.equal(result.noLines, 2, "no wrapping was needed");
        });
        it("only token sign fits", function () {
            var tokenWithSmallFirstSign = "!HHH\n.";
            var availableWidth = measurer.measure("!-").width;
            var result = wrapper.wrap(tokenWithSmallFirstSign, measurer, availableWidth);
            assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
            assert.equal(result.wrappedText, tokenWithSmallFirstSign.substring(0, 1), "wrapping was possible");
            assert.deepEqual(result.truncatedText, tokenWithSmallFirstSign.substring(1), "big letters have been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("one time wrapping", function () {
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
    describe("Max lines", function () {
        var text;
        beforeEach(function () {
            text = "hello  world!.\nhello  world!.";
            wrapper = new SVGTypewriter.Wrappers.Wrapper().textTrimming("none");
        });
        it("no lines fits", function () {
            var dimensions = measurer.measure(text);
            wrapper.maxLines(0);
            var result = wrapper.wrap(text, measurer, dimensions.width * 2);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.deepEqual(result.wrappedText, "", "wrapped text contains non characters");
            assert.deepEqual(result.truncatedText, text, "maxLines truncates both lines");
            assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.equal(result.noLines, 0, "no lines fits");
        });
        it("does not wrap", function () {
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
        it("one time wrapping", function () {
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
        it("in the middle of line", function () {
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
    describe("Ellipsis", function () {
        var text;
        beforeEach(function () {
            text = "hello";
            wrapper = new SVGTypewriter.Wrappers.Wrapper().maxLines(1);
        });
        it("single word", function () {
            var availableWidth = measurer.measure(text).width - 0.1;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.notEqual(result.wrappedText.indexOf("..."), -1, "ellipsis has been added");
            assert.deepEqual(result.noBrokeWords, 1, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("single token fits", function () {
            var text = "!HHH";
            var availableWidth = measurer.measure("!...").width;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.deepEqual(result.wrappedText, "!...", "ellipsis has been added");
            assert.deepEqual(result.truncatedText, "HHH", "only first sign fits");
            assert.deepEqual(result.noBrokeWords, 0, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("nothing fits", function () {
            var text = "!HHH";
            var availableWidth = measurer.measure("..").width;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.deepEqual(result.wrappedText, "..", "ellipsis has been added");
            assert.deepEqual(result.truncatedText, "!HHH", "whole word is truncated");
            assert.deepEqual(result.noBrokeWords, 0, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("handling whitespaces", function () {
            text = "this            aa";
            var availableWidth = measurer.measure(text).width - 1;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.deepEqual(result.wrappedText, "this...", "whitespaces has been ommited");
            assert.deepEqual(result.truncatedText, "aa", "suffix has been truncated");
            assert.deepEqual(result.noBrokeWords, 1, "one break");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("ellipsis just fit", function () {
            var availableWidth = measurer.measure("h-").width;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.deepEqual(result.wrappedText, "...", "ellipsis has been added");
            assert.deepEqual(result.truncatedText, text, "text has been truncated");
            assert.deepEqual(result.noBrokeWords, 1, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("multiple token", function () {
            text = "hello world!";
            var availableWidth = measurer.measure("hello worl-").width;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.operator(result.wrappedText.indexOf("..."), ">", 0, "ellipsis has been added");
            assert.deepEqual(result.wrappedText.substring(0, result.wrappedText.length - 3) + result.truncatedText, text, "non of letters disappeard");
            assert.deepEqual(result.noBrokeWords, 1, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("multiple lines", function () {
            text = "hello  world!.\nhello  world!.";
            var availableWidth = measurer.measure(text).width;
            var result = wrapper.wrap(text, measurer, availableWidth);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.operator(result.wrappedText.indexOf("..."), ">", 0, "ellipsis has been added");
            assert.deepEqual(result.wrappedText.substring(0, result.wrappedText.length - 3) + result.truncatedText, text, "non of letters disappeard");
            assert.deepEqual(result.noBrokeWords, 0, "one breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
    });
    describe("Single Line wrapper", function () {
        beforeEach(function () {
            wrapper = new SVGTypewriter.Wrappers.SingleLineWrapper().maxLines(2);
        });
        it("simple", function () {
            var text = "hello  world!.";
            var availableWidth = measurer.measure(text).width - 2;
            var baseWrapper = new SVGTypewriter.Wrappers.Wrapper().maxLines(2);
            var result = wrapper.wrap(text, measurer, availableWidth);
            var baseResult = baseWrapper.wrap(text, measurer, availableWidth);
            var baseDimensions = measurer.measure(baseResult.wrappedText);
            var dimensions = measurer.measure(result.wrappedText);
            assert.deepEqual(result.originalText, text, "original text has been set");
            assert.notEqual(result.wrappedText, text, "wrapped text is not the whole line");
            assert.notEqual(result.wrappedText, baseResult.wrappedText, "wrapped text looks better");
            assert.operator(dimensions.width, "<", baseDimensions.width, "occupies less width");
            assert.equal(dimensions.height, baseDimensions.height, "occupies same height");
            assert.operator(dimensions.width, "<=", availableWidth, "wrapped text fits in");
        });
        it("only one line", function () {
            var text = "hello  world!.\naa";
            var availableWidth = measurer.measure(text).width - 2;
            assert.throws(function () { return wrapper.wrap(text, measurer, availableWidth); }, "SingleLineWrapper is designed to work only on single line");
        });
    });
    afterEach(function () {
        svg.remove();
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Writer Test Suite", function () {
    var wrapper;
    var measurer;
    var writer;
    var svg;
    var writeOptions;
    var isHorizontal;
    var checkWriting = function (text, width, height, checkTitle) {
        if (checkTitle === void 0) { checkTitle = false; }
        svg.attr("width", width);
        svg.attr("height", height);
        writer.write(text, width, height, writeOptions);
        var bbox = SVGTypewriter.Utils.DOM.getBBox(svg.select(".text-area"));
        var dimensions = measurer.measure(wrapper.wrap(text, measurer, isHorizontal ? width : height, isHorizontal ? height : width).wrappedText);
        assert.closeTo(bbox.width, dimensions.width, 1, "width should be almost the same");
        assert.closeTo(bbox.height, dimensions.height, 1, "height should be almost the same");
        assertBBoxInclusion(svg, svg.select(".text-area"));
        assert.equal(svg.select(".text-container").select("title").empty(), !checkTitle, "title was creatin accordingly");
        svg.remove();
    };
    beforeEach(function () {
        svg = generateSVG(200, 200);
        measurer = new SVGTypewriter.Measurers.Measurer(svg);
        wrapper = new SVGTypewriter.Wrappers.Wrapper();
        writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
        writeOptions = {
            selection: svg,
            xAlign: "left",
            yAlign: "top",
            textRotation: 0
        };
    });
    describe("Horizontal", function () {
        beforeEach(function () {
            writeOptions.textRotation = 0;
            isHorizontal = true;
        });
        it("writer ID", function () {
            var writer2 = new SVGTypewriter.Writers.Writer(measurer, wrapper);
            assert.operator(writer._writerID, "<", writer2._writerID, "unique writer ID");
            svg.remove();
        });
        it("one word", function () {
            checkWriting("test", 200, 200);
        });
        it("multiple lines", function () {
            checkWriting("test\ntest", 200, 200);
        });
        it("wrapping", function () {
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("whitespaces", function () {
            checkWriting("a    a", 50, 150);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment corner", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "bottom";
            writeOptions.xAlign = "right";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writeOptions.xAlign = "center";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
    });
    describe("Horizontal flipside", function () {
        beforeEach(function () {
            writeOptions.textRotation = 180;
            isHorizontal = true;
        });
        it("one word", function () {
            checkWriting("test", 200, 200);
        });
        it("multiple lines", function () {
            checkWriting("test\ntest", 200, 200);
        });
        it("wrapping", function () {
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("whitespaces", function () {
            checkWriting("a    a", 50, 150);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment corner", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "bottom";
            writeOptions.xAlign = "right";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writeOptions.xAlign = "center";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("addTitleElement", function () {
            wrapper.maxLines(3);
            writer.addTitleElement(true);
            checkWriting("reallylongsentencewithmanycharacters", 50, 150, true);
        });
    });
    describe("Vertical left", function () {
        beforeEach(function () {
            writeOptions.textRotation = -90;
            isHorizontal = false;
        });
        it("one word", function () {
            checkWriting("test", 200, 200);
        });
        it("multiple lines", function () {
            checkWriting("test\ntest", 200, 200);
        });
        it("wrapping", function () {
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("whitespaces", function () {
            checkWriting("a    a", 50, 150);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment corner", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "bottom";
            writeOptions.xAlign = "right";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writeOptions.xAlign = "center";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
    });
    describe("Vertical right", function () {
        beforeEach(function () {
            writeOptions.textRotation = 90;
            isHorizontal = false;
        });
        it("one word", function () {
            checkWriting("test", 200, 200);
        });
        it("multiple lines", function () {
            checkWriting("test\ntest", 200, 200);
        });
        it("wrapping", function () {
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("whitespaces", function () {
            checkWriting("a    a", 50, 150);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment corner", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "bottom";
            writeOptions.xAlign = "right";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writeOptions.xAlign = "center";
            checkWriting("reallylongsentencewithmanycharacters", 50, 150);
        });
    });
    describe("Animator", function () {
        beforeEach(function () {
            writeOptions.animator = new SVGTypewriter.Animators.BaseAnimator();
            isHorizontal = true;
        });
        it.skip("simple", function () {
            checkWriting("test", 200, 200);
        });
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("String Methods Test Suite", function () {
    var utils = SVGTypewriter.Utils.StringMethods;
    it("combine whitespaces works as expected", function () {
        assert.equal(utils.combineWhitespace("a"), "a", "combine whitespaces returns same single letter");
        assert.equal(utils.combineWhitespace("a "), "a ", "combine whitespaces returns same single letter with space");
        assert.equal(utils.combineWhitespace(" "), " ", "combine whitespaces returns same single space");
        assert.equal(utils.combineWhitespace("    "), " ", "combine whitespaces returns same single letter with sapce");
        assert.equal(utils.combineWhitespace("a    aa"), "a aa", "combine whitespaces returns words with single space between");
        assert.equal(utils.combineWhitespace("aa   \t   aa"), "aa aa", "combine whitespaces returns words with single space between");
    });
    it("trimStart works as expected", function () {
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
    it("trimEnd works as expected", function () {
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

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Measurer Test Suite", function () {
    var svg;
    var measurer;
    describe("Text element", function () {
        var defaultText;
        var textSelection;
        beforeEach(function () {
            svg = generateSVG(200, 200);
            defaultText = "a\na";
            textSelection = svg.append("text");
            textSelection.text(defaultText);
            measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
        });
        it("resets default string", function () {
            measurer.measure("hello world");
            assert.deepEqual(textSelection.text(), defaultText, "Text inside selection has been reseted to default");
        });
        it("default text", function () {
            assert.deepEqual(measurer.measure(), measurer.measure(SVGTypewriter.Measurers.AbstractMeasurer.HEIGHT_TEXT), "default text was used");
        });
        it("works on empty string", function () {
            var result = measurer.measure("");
            assert.deepEqual(result, { width: 0, height: 0 }, "empty string has 0 width and height");
        });
        it("works on whitespaces", function () {
            var result = measurer.measure(" \t  ");
            assert.equal(result.width, 0, "whitespace has width 0");
            assert.equal(result.height, 0, "whitespace has height 0");
        });
        it("works on whitespaces in middle", function () {
            var baseResult = measurer.measure("a a");
            var result = measurer.measure("a   a");
            assert.equal(result.width, baseResult.width, "multiple whitespaces occupy same space");
            assert.equal(result.height, baseResult.height, "height is the same");
        });
        it("works on multiple lines", function () {
            var baseResult = measurer.measure("a");
            var result = measurer.measure("a\na");
            assert.equal(result.width, baseResult.width, "width has not changed");
            assert.equal(result.height, baseResult.height * 2, "height has changed");
        });
        afterEach(function () {
            svg.remove();
        });
    });
    describe("Cache measurer", function () {
        beforeEach(function () {
            svg = generateSVG(200, 200);
            measurer = new SVGTypewriter.Measurers.CacheCharacterMeasurer(svg);
        });
        it("line", function () {
            var text = "helloworld";
            var dimesnsions = measurer.measure(text);
            var characterDimensions = text.split("").map(function (c) { return measurer.measure(c); });
            var dimensionsByCharacter = {
                width: d3.sum(characterDimensions.map(function (c) { return c.width; })),
                height: d3.max(characterDimensions.map(function (c) { return c.height; }))
            };
            assert.deepEqual(dimesnsions, dimensionsByCharacter, "text has been measured by characters.");
        });
        afterEach(function () {
            svg.remove();
        });
    });
    describe("DOM element", function () {
        before(function () {
            svg = generateSVG(200, 200);
            measurer = new SVGTypewriter.Measurers.Measurer(svg);
        });
        it("class is applied", function () {
            var className = "testClass";
            var measurerWithClass = new SVGTypewriter.Measurers.Measurer(svg, className);
            var originalMeasureBBox = measurerWithClass.measureBBox;
            measurerWithClass.measureBBox = function (d, text) {
                assert.isTrue(d.classed(className), "class has been applied to text element");
                return originalMeasureBBox(d, text);
            };
            measurer.measure();
        });
        it("works on empty string", function () {
            var result = measurer.measure("");
            assert.deepEqual(result, { width: 0, height: 0 }, "empty string has 0 width and height");
        });
        it("works on whitespaces", function () {
            var result = measurer.measure(" \t  ");
            assert.equal(result.width, 0, "whitespace has width 0");
            assert.equal(result.height, 0, "whitespace has height 0");
        });
        it("works on multiple lines", function () {
            var baseResult = measurer.measure("a");
            var result = measurer.measure("a\na");
            assert.equal(result.width, baseResult.width, "width has not changed");
            assert.equal(result.height, baseResult.height * 2, "height has changed");
        });
        after(function () {
            svg.remove();
        });
    });
});
