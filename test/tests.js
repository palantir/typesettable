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
