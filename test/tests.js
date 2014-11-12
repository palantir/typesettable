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
    beforeEach(function () {
        svg = generateSVG(200, 200);
        var textSelection = svg.append("text");
        measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
        wrapper = new SVGTypewriter.Wrappers.Wrapper();
        writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
    });
    describe("Horizontal", function () {
        beforeEach(function () {
            writeOptions = {
                selection: svg,
                xAlign: "left",
                yAlign: "top",
                textOrientation: "horizontal"
            };
        });
        it("one word", function () {
            writer.write("test", 200, 200, writeOptions);
        });
        it("multiple lines", function () {
            writer.write("test\ntest", 200, 200, writeOptions);
        });
        it("wrapping", function () {
            writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
        });
        it("allignment", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writer.write("reallylongsentencewithmanycharacters", 50, 150, writeOptions);
        });
    });
    describe("Vertical left", function () {
        beforeEach(function () {
            writeOptions = {
                selection: svg,
                xAlign: "bottom",
                yAlign: "left",
                textOrientation: "left"
            };
        });
        it("one word", function () {
            writer.write("test", 200, 200, writeOptions);
        });
        it("multiple lines", function () {
            writer.write("test\ntest", 200, 200, writeOptions);
        });
        it("wrapping", function () {
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "center";
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("allignment right", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.yAlign = "right";
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
    });
    describe("Vertical right", function () {
        beforeEach(function () {
            writeOptions = {
                selection: svg,
                xAlign: "top",
                yAlign: "left",
                textOrientation: "right"
            };
        });
        it("one word", function () {
            writer.write("test", 200, 200, writeOptions);
        });
        it("multiple lines", function () {
            writer.write("test\ntest", 200, 200, writeOptions);
        });
        it("wrapping", function () {
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("maxLines", function () {
            wrapper.maxLines(3);
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("maxLines + no ellipsis", function () {
            wrapper.maxLines(3).textTrimming("none");
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("allignment center", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.xAlign = "center";
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
        it("allignment bottom", function () {
            wrapper.maxLines(3).textTrimming("none");
            writeOptions.xAlign = "bottom";
            writer.write("reallylongsentencewithmanycharacters", 150, 50, writeOptions);
        });
    });
    afterEach(function () {
        svg.remove();
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Converter Test Suite", function () {
    describe("Ident Converter", function () {
        it("single letter", function () {
            var s;
            var id = SVGTypewriter.Converters.ident();
            s = "a";
            assert.equal(s, id(s), "ident returns same single letter");
        });
        it("multiple letter", function () {
            var s;
            var id = SVGTypewriter.Converters.ident();
            s = "aaaa";
            assert.equal(s, id(s), "ident returns same multiple letter");
        });
        it("special character", function () {
            var s;
            var id = SVGTypewriter.Converters.ident();
            s = "<?#$";
            assert.equal(s, id(s), "ident returns same special characters");
        });
        it("multiple words", function () {
            var s;
            var id = SVGTypewriter.Converters.ident();
            s = "foo bar boo\n fun zoo.\n";
            assert.equal(s, id(s), "ident returns same multiple words");
        });
    });
    describe("Combine White Spaces Converter", function () {
        it("single letter", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = "a";
            assert.equal(s, converter(s), "combine whitespaces returns same single letter");
        });
        it("single space", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = "a ";
            assert.equal(s, converter(s), "combine whitespaces returns same single letter with sapce");
        });
        it("only space", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = " ";
            assert.equal(s, converter(s), "combine whitespaces returns same single space");
        });
        it("multiple space", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = "    ";
            assert.equal(" ", converter(s), "combine whitespaces returns single space");
        });
        it("multiple space between words", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = "aa    aa";
            assert.equal("aa aa", converter(s), "combine whitespaces returns words with single space between");
        });
        it("multiple whitechars between words", function () {
            var s;
            var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
            s = "aa    \taa";
            assert.equal("aa aa", converter(s), "combine whitespaces returns words with single space between");
        });
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
        it("works on whitespace", function () {
            var result = measurer.measure(" ");
            assert.operator(result.width, ">", 0, "whitespace has width greater than 0");
            assert.operator(result.height, ">", 0, "whitespace has height greater than 0");
        });
        it("works on multiple whitespaces", function () {
            var baseResult = measurer.measure(" ");
            var result = measurer.measure("   ");
            assert.equal(result.width, baseResult.width, "width has no changed");
            assert.equal(result.height, baseResult.height, "height has not changed");
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
            var text = "hello world";
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
        it("works on whitespace", function () {
            var result = measurer.measure(" ");
            assert.operator(result.width, ">", 0, "whitespace has width greater than 0");
            assert.operator(result.height, ">", 0, "whitespace has height greater than 0");
        });
        it("works on multiple whitespaces", function () {
            var baseResult = measurer.measure(" ");
            var result = measurer.measure("   ");
            assert.equal(result.width, baseResult.width, "width has no changed");
            assert.equal(result.height, baseResult.height, "height has not changed");
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
