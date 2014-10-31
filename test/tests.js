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
    before(function () {
        svg = generateSVG(200, 200);
        var textSelection = svg.append("text");
        measurer = new SVGTypewriter.Measurers.Measurer(textSelection);
        wrapper = new SVGTypewriter.Wrappers.Wrapper(measurer);
    });
    describe("Core", function () {
        it("time trimming option", function () {
            assert.doesNotThrow(function () { return wrapper.textTrimming("none"); });
        });
        it("wrong time trimming option", function () {
            assert.throws(function () { return wrapper.textTrimming("hello"); });
        });
    });
    describe("One token wrapping", function () {
        var token;
        before(function () {
            token = "hello";
        });
        it("does not wrap", function () {
            var dimensions = measurer.measure(token);
            var result = wrapper.wrap(token, dimensions.width * 2);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.deepEqual(result.wrappedText, token, "wrapped text is the same as original");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.deepEqual(result.noLines, 1, "no wrapping was needed");
        });
        it("one time wrapping", function () {
            var availableWidth = measurer.measure(token).width * 3 / 4;
            var result = wrapper.wrap(token, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
            assert.deepEqual(result.noLines, 2, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("multi time wrapping", function () {
            var availableWidth = measurer.measure("h").width * 2;
            var result = wrapper.wrap(token, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 3, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.deepEqual(result.noBrokeWords, 1, "wrapping with breaking one word");
            assert.deepEqual(result.noLines, 3, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("wrapping is impossible", function () {
            var availableWidth = measurer.measure("h").width - 0.1;
            var result = wrapper.wrap(token, availableWidth);
            assert.deepEqual(result.originalText, token, "original text has been set");
            assert.equal(result.wrappedText, "", "wrapping was impossible");
            assert.deepEqual(result.truncatedText, token, "whole text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
        });
        it("only first sign fits", function () {
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
    describe("One line wrapping", function () {
        var line;
        before(function () {
            line = "hello  world!.";
        });
        it("does not wrap", function () {
            var dimensions = measurer.measure(line);
            var result = wrapper.wrap(line, dimensions.width * 2);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.deepEqual(result.wrappedText, line, "wrapped text is the same as original");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 0, "non of tokens has been broken");
            assert.equal(result.noLines, 1, "no wrapping was needed");
        });
        it("only token sign fits", function () {
            var tokenWithSmallFirstSign = "!HHH";
            var availableWidth = measurer.measure("!-").width;
            var result = wrapper.wrap(tokenWithSmallFirstSign, availableWidth);
            assert.deepEqual(result.originalText, tokenWithSmallFirstSign, "original text has been set");
            assert.equal(result.wrappedText, "!", "wrapping was possible");
            assert.deepEqual(result.truncatedText, "HHH", "big letters have been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 1, "wrapped text has one lines");
        });
        it("one time wrapping", function () {
            var availableWidth = measurer.measure(line).width * 3 / 4;
            var result = wrapper.wrap(line, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 2, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 1, "wrapping with breaking one word");
            assert.equal(result.noLines, 2, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("multi time wrapping", function () {
            var availableWidth = measurer.measure("hell").width;
            var result = wrapper.wrap(line, availableWidth);
            assert.isTrue(false, result.wrappedText);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.lengthOf(result.wrappedText.split("\n"), 5, "wrapping occured");
            assert.deepEqual(result.truncatedText, "", "non of the text has been truncated");
            assert.equal(result.noBrokeWords, 2, "wrapping with breaking two words");
            assert.equal(result.noLines, 5, "wrapping was needed");
            assert.operator(measurer.measure(result.wrappedText).width, "<=", availableWidth, "wrapped text fits in");
        });
        it("wrapping is impossible", function () {
            var availableWidth = measurer.measure("h").width - 0.1;
            var result = wrapper.wrap(line, availableWidth);
            assert.deepEqual(result.originalText, line, "original text has been set");
            assert.equal(result.wrappedText, "", "wrapping was impossible");
            assert.deepEqual(result.truncatedText, line, "whole text has been truncated");
            assert.deepEqual(result.noBrokeWords, 0, "no breaks");
            assert.deepEqual(result.noLines, 0, "wrapped text has no lines");
        });
        it("wrapping many whitespaces", function () {
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
    after(function () {
        svg.remove();
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Test suite", function () {
    it("example test", function () {
        assert.equal(0, 0, "math didn't fail :)");
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Parser Test Suite", function () {
    describe("Ident Parser", function () {
        it("single letter", function () {
            var s;
            var id = SVGTypewriter.Parsers.ident();
            s = "a";
            assert.equal(s, id(s), "ident returns same single letter");
        });
        it("multiple letter", function () {
            var s;
            var id = SVGTypewriter.Parsers.ident();
            s = "aaaa";
            assert.equal(s, id(s), "ident returns same multiple letter");
        });
        it("special character", function () {
            var s;
            var id = SVGTypewriter.Parsers.ident();
            s = "<?#$";
            assert.equal(s, id(s), "ident returns same special characters");
        });
        it("multiple words", function () {
            var s;
            var id = SVGTypewriter.Parsers.ident();
            s = "foo bar boo\n fun zoo.\n";
            assert.equal(s, id(s), "ident returns same multiple words");
        });
    });
    describe("Combine White Spaces Parser", function () {
        it("single letter", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = "a";
            assert.equal(s, parser(s), "combine whitespaces returns same single letter");
        });
        it("single space", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = "a ";
            assert.equal(s, parser(s), "combine whitespaces returns same single letter with sapce");
        });
        it("only space", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = " ";
            assert.equal(s, parser(s), "combine whitespaces returns same single space");
        });
        it("multiple space", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = "    ";
            assert.equal(" ", parser(s), "combine whitespaces returns single space");
        });
        it("multiple space between words", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = "aa    aa";
            assert.equal("aa aa", parser(s), "combine whitespaces returns words with single space between");
        });
        it("multiple whitechars between words", function () {
            var s;
            var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
            s = "aa    \taa";
            assert.equal("aa aa", parser(s), "combine whitespaces returns words with single space between");
        });
    });
});

///<reference path="../testReference.ts" />
var assert = chai.assert;
describe("Measurer Test Suite", function () {
    var svg;
    var measurer;
    var defaultText;
    var textSelection;
    before(function () {
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
