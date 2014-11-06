/*!
SVG Typewriter 0.0.1 (https://github.com/endrjuskr/svg-typewriter)
Copyright 2014 Palantir Technologies
Licensed under MIT (https://github.com/endrjuskr/svg-typewriter/blob/master/LICENSE)

          ************************************************
          **          Looking for readable source?      **
          **    Check out the .ts (typescript) file!    **
          ************************************************

*/

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        (function (Methods) {
            /**
             * Check if two arrays are equal by strict equality.
             */
            function arrayEq(a, b) {
                // Technically, null and undefined are arrays too
                if (a == null || b == null) {
                    return a === b;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }
            Methods.arrayEq = arrayEq;
            /**
             * @param {any} a Object to check against b for equality.
             * @param {any} b Object to check against a for equality.
             *
             * @returns {boolean} whether or not two objects share the same keys, and
             *          values associated with those keys. Values will be compared
             *          with ===.
             */
            function objEq(a, b) {
                if (a == null || b == null) {
                    return a === b;
                }
                var keysA = Object.keys(a).sort();
                var keysB = Object.keys(b).sort();
                var valuesA = keysA.map(function (k) { return a[k]; });
                var valuesB = keysB.map(function (k) { return b[k]; });
                return arrayEq(keysA, keysB) && arrayEq(valuesA, valuesB);
            }
            Methods.objEq = objEq;
            function isNotEmptyString(str) {
                return str && str.trim() !== "";
            }
            Methods.isNotEmptyString = isNotEmptyString;
        })(Utils.Methods || (Utils.Methods = {}));
        var Methods = Utils.Methods;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        (function (DOM) {
            function transform(s, x, y) {
                var xform = d3.transform(s.attr("transform"));
                if (x == null) {
                    return xform.translate;
                }
                else {
                    y = (y == null) ? 0 : y;
                    xform.translate[0] = x;
                    xform.translate[1] = y;
                    s.attr("transform", xform.toString());
                    return s;
                }
            }
            DOM.transform = transform;
            function getBBox(element) {
                var bbox;
                try {
                    bbox = element.node().getBBox();
                }
                catch (err) {
                    bbox = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                }
                return bbox;
            }
            DOM.getBBox = getBBox;
        })(Utils.DOM || (Utils.DOM = {}));
        var DOM = Utils.DOM;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        var Cache = (function () {
            /**
             * @constructor
             *
             * @param {string} compute The function whose results will be cached.
             * @param {(v: T, w: T) => boolean} [valueEq]
             *        Used to determine if the value of canonicalKey has changed.
             *        If omitted, defaults to === comparision.
             */
            function Cache(compute, valueEq) {
                if (valueEq === void 0) { valueEq = function (v, w) { return v === w; }; }
                this.cache = d3.map();
                this.compute = compute;
                this.valueEq = valueEq;
            }
            /**
             * Attempt to look up k in the cache, computing the result if it isn't
             * found.
             *
             * @param {string} k The key to look up in the cache.
             * @return {T} The value associated with k; the result of compute(k).
             */
            Cache.prototype.get = function (k) {
                if (!this.cache.has(k)) {
                    this.cache.set(k, this.compute(k));
                }
                return this.cache.get(k);
            };
            /**
             * Reset the cache empty.
             *
             * @return {Cache<T>} The calling Cache.
             */
            Cache.prototype.clear = function () {
                this.cache = d3.map();
                return this;
            };
            return Cache;
        })();
        Utils.Cache = Cache;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        var Tokenizer = (function () {
            function Tokenizer() {
                this.WordDividerRegExp = new RegExp("\\W");
                this.WhitespaceRegExp = new RegExp("\\s");
            }
            Tokenizer.prototype.tokenize = function (line) {
                var _this = this;
                return line.split("").reduce(function (tokens, c) { return tokens.slice(0, -1).concat(_this.shouldCreateNewToken(tokens[tokens.length - 1], c)); }, [""]);
            };
            Tokenizer.prototype.shouldCreateNewToken = function (token, newCharacter) {
                if (!token) {
                    return [newCharacter];
                }
                var lastCharacter = token[token.length - 1];
                if (this.WhitespaceRegExp.test(lastCharacter) && this.WhitespaceRegExp.test(newCharacter)) {
                    return [token + newCharacter];
                }
                else if (this.WhitespaceRegExp.test(lastCharacter) || this.WhitespaceRegExp.test(newCharacter)) {
                    return [token, newCharacter];
                }
                else if (!(this.WordDividerRegExp.test(lastCharacter) || this.WordDividerRegExp.test(newCharacter))) {
                    return [token + newCharacter];
                }
                else if (lastCharacter === newCharacter) {
                    return [token + newCharacter];
                }
                else {
                    return [token, newCharacter];
                }
            };
            return Tokenizer;
        })();
        Utils.Tokenizer = Tokenizer;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Converters) {
        function ident() {
            return function (s) { return s; };
        }
        Converters.ident = ident;
        /**
         * @return {Parser} A converter that will treat all
         * sequences of consecutive whitespace as a single " ".
         */
        function combineWhitespace(con) {
            return function (s) { return con(s.replace(/\s+/g, " ")); };
        }
        Converters.combineWhitespace = combineWhitespace;
    })(SVGTypewriter.Converters || (SVGTypewriter.Converters = {}));
    var Converters = SVGTypewriter.Converters;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Wrappers) {
        var Wrapper = (function () {
            function Wrapper() {
                this.maxLines(Infinity);
                this.textTrimming("ellipsis");
                this.allowBreakingWords(true);
                this._tokenizer = new SVGTypewriter.Utils.Tokenizer();
                this._breakingCharacter = "-";
            }
            Wrapper.prototype.maxLines = function (noLines) {
                if (noLines == null) {
                    return this._maxLines;
                }
                else {
                    this._maxLines = noLines;
                    return this;
                }
            };
            Wrapper.prototype.textTrimming = function (option) {
                if (option == null) {
                    return this._textTrimming;
                }
                else {
                    if (option !== "ellipsis" && option !== "none") {
                        throw new Error(option + " - unsupported text trimming option.");
                    }
                    this._textTrimming = option;
                    return this;
                }
            };
            Wrapper.prototype.allowBreakingWords = function (allow) {
                if (allow == null) {
                    return this._allowBreakingWords;
                }
                else {
                    this._allowBreakingWords = allow;
                    return this;
                }
            };
            Wrapper.prototype.wrap = function (text, measurer, width, height) {
                return this.breakLineToFitWidth(text, width, measurer);
            };
            Wrapper.prototype.breakLineToFitWidth = function (text, availableWidth, measurer) {
                var _this = this;
                var tokens = this._tokenizer.tokenize(text);
                var initialWrappingResult = {
                    originalText: text,
                    wrappedText: "",
                    noLines: 0,
                    noBrokeWords: 0,
                    truncatedText: ""
                };
                var state = {
                    wrapping: initialWrappingResult,
                    remainingWidthInLine: availableWidth,
                    availableWidth: availableWidth,
                    canFitText: true
                };
                return tokens.reduce(function (state, token) { return state.canFitText ? _this.wrapNextToken(token, state, measurer) : _this.truncateNextToken(token, state); }, state).wrapping;
            };
            Wrapper.prototype.truncateNextToken = function (token, state) {
                state.wrapping.truncatedText += token;
                return state;
            };
            Wrapper.prototype.wrapNextToken = function (token, state, measurer) {
                var remainingToken = token;
                var lastRemainingToken;
                var remainingWidth = state.remainingWidthInLine;
                var lastRemainingWidth;
                var brokeWord = false;
                var wrappedText = "";
                var noLines = 0;
                while (remainingToken && (remainingWidth !== lastRemainingWidth || remainingToken !== lastRemainingToken)) {
                    var result = this.breakTokenToFitInWidth(remainingToken, remainingWidth, measurer);
                    wrappedText += result.brokenToken[0];
                    lastRemainingToken = remainingToken;
                    lastRemainingWidth = remainingWidth;
                    if (SVGTypewriter.Utils.Methods.isNotEmptyString(result.brokenToken[0]) && SVGTypewriter.Utils.Methods.isNotEmptyString(result.brokenToken[1])) {
                        brokeWord = true;
                    }
                    remainingToken = result.brokenToken[1];
                    remainingWidth = result.remainingWidth || state.availableWidth;
                    if (remainingToken !== undefined) {
                        ++noLines;
                    }
                }
                if (remainingToken) {
                    state.canFitText = false;
                    state.wrapping.truncatedText += token;
                }
                else {
                    if (state.wrapping.noLines === 0) {
                        ++state.wrapping.noLines;
                    }
                    state.remainingWidthInLine = remainingWidth;
                    state.wrapping.noBrokeWords += +brokeWord;
                    state.wrapping.wrappedText += wrappedText;
                    state.wrapping.noLines += noLines;
                }
                return state;
            };
            Wrapper.prototype.breakTokenToFitInWidth = function (token, availableWidth, measurer) {
                var tokenWidth = measurer.measure(token).width;
                if (tokenWidth <= availableWidth) {
                    return {
                        brokenToken: [token],
                        remainingWidth: availableWidth - tokenWidth
                    };
                }
                if (token.trim() === "") {
                    return {
                        brokenToken: ["\n", ""],
                        remainingWidth: 0
                    };
                }
                if (!this._allowBreakingWords) {
                    return {
                        brokenToken: ["\n", token],
                        remainingWidth: 0
                    };
                }
                var fitToken = "";
                var tokenLetters = token.split("");
                for (var i = 0; i < tokenLetters.length; ++i) {
                    var currentLetter = tokenLetters[i];
                    if (measurer.measure(fitToken + currentLetter + this._breakingCharacter).width <= availableWidth) {
                        fitToken += currentLetter;
                    }
                    else {
                        break;
                    }
                }
                var remainingToken = token.slice(fitToken.length);
                if (fitToken.length > 0) {
                    fitToken += "-";
                }
                fitToken += "\n";
                return {
                    brokenToken: [fitToken, remainingToken],
                    remainingWidth: 0
                };
            };
            return Wrapper;
        })();
        Wrappers.Wrapper = Wrapper;
    })(SVGTypewriter.Wrappers || (SVGTypewriter.Wrappers = {}));
    var Wrappers = SVGTypewriter.Wrappers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Writers) {
        var Writer = (function () {
            function Writer(measurer, wrapper) {
                this.measurer(measurer);
                this.wrapper(wrapper);
            }
            Writer.prototype.measurer = function (newMeasurer) {
                if (newMeasurer == null) {
                    return this._measurer;
                }
                else {
                    this._measurer = newMeasurer;
                    return this;
                }
            };
            Writer.prototype.wrapper = function (newWrapper) {
                if (newWrapper == null) {
                    return this._wrapper;
                }
                else {
                    this._wrapper = newWrapper;
                    return this;
                }
            };
            Writer.prototype.writeLine = function (line, g, align) {
                if (align === void 0) { align = "left"; }
                var textEl = g.append("text");
                textEl.text(line);
                var anchor = Writer.AnchorConverter[align];
                textEl.attr("text-anchor", anchor);
            };
            Writer.prototype.write = function (text, width, height, options) {
                var _this = this;
                var wrappedText = this._wrapper.wrap(text, this._measurer, width, height).wrappedText;
                var innerG = options.selection.append("g").classed("writeText-inner-g", true);
                var lines = wrappedText.split("\n");
                var h = this._measurer.measure(Writer.HEIGHT_TEXT).height;
                lines.forEach(function (line, i) {
                    var selection = innerG.append("g");
                    SVGTypewriter.Utils.DOM.transform(selection, 0, (i + 1) * h);
                    _this.writeLine(line, selection);
                });
            };
            Writer.AnchorConverter = {
                left: "start",
                center: "middle",
                right: "end"
            };
            Writer.HEIGHT_TEXT = "bqpdl";
            return Writer;
        })();
        Writers.Writer = Writer;
    })(SVGTypewriter.Writers || (SVGTypewriter.Writers = {}));
    var Writers = SVGTypewriter.Writers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        ;
        var AbstractMeasurer = (function () {
            function AbstractMeasurer(area) {
                this.measurerArea = area;
                this.defaultText = area.text();
            }
            AbstractMeasurer.prototype.measure = function (text) {
                this.measurerArea.text(text);
                var bb = SVGTypewriter.Utils.DOM.getBBox(this.measurerArea);
                var areaDimension = { width: bb.width, height: bb.height };
                this.measurerArea.text(this.defaultText);
                return areaDimension;
            };
            return AbstractMeasurer;
        })();
        Measurers.AbstractMeasurer = AbstractMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var Measurer = (function (_super) {
            __extends(Measurer, _super);
            function Measurer() {
                _super.apply(this, arguments);
            }
            Measurer.prototype._addGuards = function (text) {
                return Measurer.NotWhitespaceCharacter + text + Measurer.NotWhitespaceCharacter;
            };
            Measurer.prototype.getNotWhitespaceCharacterWidth = function () {
                if (this.nonWhitespaceCharacterWidth == null) {
                    this.nonWhitespaceCharacterWidth = _super.prototype.measure.call(this, Measurer.NotWhitespaceCharacter).width;
                }
                return this.nonWhitespaceCharacterWidth;
            };
            Measurer.prototype._measureLine = function (line) {
                var measuredLine = this._addGuards(line);
                var measuredLineDimensions = _super.prototype.measure.call(this, measuredLine);
                measuredLineDimensions.width -= 2 * this.getNotWhitespaceCharacterWidth();
                return measuredLineDimensions;
            };
            Measurer.prototype.measure = function (text) {
                var _this = this;
                if (text == null || text === "") {
                    return { width: 0, height: 0 };
                }
                var linesDimensions = text.split("\n").map(function (line) { return _this._measureLine(line); });
                return {
                    width: d3.max(linesDimensions, function (dim) { return dim.width; }),
                    height: d3.sum(linesDimensions, function (dim) { return dim.height; })
                };
            };
            Measurer.NotWhitespaceCharacter = "a";
            return Measurer;
        })(Measurers.AbstractMeasurer);
        Measurers.Measurer = Measurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var CharacterMeasurer = (function (_super) {
            __extends(CharacterMeasurer, _super);
            function CharacterMeasurer() {
                _super.apply(this, arguments);
            }
            CharacterMeasurer.prototype._measureCharacter = function (c) {
                return _super.prototype.measure.call(this, c);
            };
            CharacterMeasurer.prototype._measureLine = function (line) {
                var _this = this;
                var charactersDimensions = line.split("").map(function (c) { return _this._measureCharacter(c); });
                return {
                    width: d3.sum(charactersDimensions, function (dim) { return dim.width; }),
                    height: d3.max(charactersDimensions, function (dim) { return dim.height; })
                };
            };
            return CharacterMeasurer;
        })(Measurers.Measurer);
        Measurers.CharacterMeasurer = CharacterMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var CacheCharacterMeasurer = (function (_super) {
            __extends(CacheCharacterMeasurer, _super);
            function CacheCharacterMeasurer(area) {
                _super.call(this, area);
                this.cache = new SVGTypewriter.Utils.Cache(_super.prototype._measureCharacter, SVGTypewriter.Utils.Methods.objEq);
            }
            CacheCharacterMeasurer.prototype._measureCharacter = function (c) {
                return this.cache.get(c);
            };
            return CacheCharacterMeasurer;
        })(Measurers.CharacterMeasurer);
        Measurers.CacheCharacterMeasurer = CacheCharacterMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));
