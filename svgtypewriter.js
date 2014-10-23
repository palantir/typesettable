/*!
SVG Typewriter 0.0.1 (https://github.com/endrjuskr/svg-typewriter)
Copyright 2014 Palantir Technologies
Licensed under MIT (https://github.com/endrjuskr/svg-typewriter/blob/master/LICENSE)

          ************************************************
          **          Looking for readable source?      **
          **    Check out the .ts (typescript) file!    **
          ************************************************

*/

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Parsers) {
        function ident() {
            return function (s) { return s; };
        }
        Parsers.ident = ident;
        /**
         * @return {Parser} A test parser that will treat all
         * sequences of consecutive whitespace as a single " ".
         */
        function combineWhitespace(pr) {
            return function (s) { return pr(s.replace(/\s+/g, " ")); };
        }
        Parsers.combineWhitespace = combineWhitespace;
    })(SVGTypewriter.Parsers || (SVGTypewriter.Parsers = {}));
    var Parsers = SVGTypewriter.Parsers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />

///<reference path="reference.ts" />
var SvgTypeWriter;
(function (SvgTypeWriter) {
    var Writer = (function () {
        function Writer() {
        }
        return Writer;
    })();
    SvgTypeWriter.Writer = Writer;
})(SvgTypeWriter || (SvgTypeWriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    var Measurer = (function () {
        function Measurer(area) {
            this.measurerArea = area;
        }
        return Measurer;
    })();
    SVGTypewriter.Measurer = Measurer;
})(SVGTypewriter || (SVGTypewriter = {}));
