
declare module SVGTypewriter.Utils.Methods {
    /**
     * Check if two arrays are equal by strict equality.
     */
    function arrayEq<T>(a: T[], b: T[]): boolean;
    /**
     * @param {any} a Object to check against b for equality.
     * @param {any} b Object to check against a for equality.
     *
     * @returns {boolean} whether or not two objects share the same keys, and
     *          values associated with those keys. Values will be compared
     *          with ===.
     */
    function objEq(a: any, b: any): boolean;
    function isNotEmptyString(str: string): boolean;
}

declare module SVGTypewriter.Utils.DOM {
    function transform(s: D3.Selection, x?: number, y?: number): any;
    function getBBox(element: D3.Selection): SVGRect;
}


declare module SVGTypewriter.Utils {
    class Cache<T> {
        /**
         * @constructor
         *
         * @param {string} compute The function whose results will be cached.
         * @param {(v: T, w: T) => boolean} [valueEq]
         *        Used to determine if the value of canonicalKey has changed.
         *        If omitted, defaults to === comparision.
         */
        constructor(compute: (k: string) => T, valueEq?: (v: T, w: T) => boolean);
        /**
         * Attempt to look up k in the cache, computing the result if it isn't
         * found.
         *
         * @param {string} k The key to look up in the cache.
         * @return {T} The value associated with k; the result of compute(k).
         */
        get(k: string): T;
        /**
         * Reset the cache empty.
         *
         * @return {Cache<T>} The calling Cache.
         */
        clear(): Cache<T>;
    }
}


declare module SVGTypewriter.Utils {
    class Tokenizer {
        tokenize(line: string): string[];
    }
}


declare module SVGTypewriter {
    module Converters {
        interface Converter {
            (text: string): string;
        }
        function ident(): (s: string) => string;
        /**
         * @return {Parser} A converter that will treat all
         * sequences of consecutive whitespace as a single " ".
         */
        function combineWhitespace(con: Converter): (s: string) => string;
    }
}


declare module SVGTypewriter.Wrappers {
    interface WrappingResult {
        originalText: string;
        wrappedText: string;
        noLines: number;
        noBrokeWords: number;
        truncatedText: string;
    }
    class Wrapper {
        _breakingCharacter: string;
        constructor();
        maxLines(): number;
        maxLines(noLines: number): Wrapper;
        textTrimming(): string;
        textTrimming(option: string): Wrapper;
        allowBreakingWords(): boolean;
        allowBreakingWords(allow: boolean): Wrapper;
        wrap(text: string, measurer: Measurers.AbstractMeasurer, width: number, height?: number): WrappingResult;
    }
}


declare module SVGTypewriter.Writers {
    interface WriteOptions {
        selection: D3.Selection;
        xAlign: string;
        yAlign: string;
        textOrientation: string;
    }
    class Writer {
        constructor(measurer: Measurers.AbstractMeasurer, wrapper: Wrappers.Wrapper);
        measurer(): Measurers.AbstractMeasurer;
        measurer(newMeasurer: Measurers.AbstractMeasurer): Writer;
        wrapper(): Wrappers.Wrapper;
        wrapper(newWrapper: Wrappers.Wrapper): Writer;
        write(text: string, width: number, height: number, options: WriteOptions): void;
    }
}


declare module SVGTypewriter.Measurers {
    /**
     * Dimension of area's BBox.
     */
    interface Dimensions {
        width: number;
        height: number;
    }
    class AbstractMeasurer {
        constructor(area: D3.Selection, className?: string);
        measure(text?: string): Dimensions;
    }
}


declare module SVGTypewriter.Measurers {
    class Measurer extends AbstractMeasurer {
        _addGuards(text: string): string;
        _measureLine(line: string): Dimensions;
        measure(text: string): {
            width: number;
            height: number;
        };
    }
}


declare module SVGTypewriter.Measurers {
    class CharacterMeasurer extends Measurer {
        _measureCharacter(c: string): {
            width: number;
            height: number;
        };
        _measureLine(line: string): {
            width: number;
            height: number;
        };
    }
}


declare module SVGTypewriter.Measurers {
    class CacheCharacterMeasurer extends CharacterMeasurer {
        constructor(area: D3.Selection, className?: string);
        _measureCharacter(c: string): Dimensions;
    }
}
