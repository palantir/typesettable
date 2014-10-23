
declare module SVGTypewriter {
    module Parsers {
        interface Parser {
            (text: string): string;
        }
        function ident(): (s: string) => string;
        /**
         * @return {Parser} A test parser that will treat all
         * sequences of consecutive whitespace as a single " ".
         */
        function combineWhitespace(pr: Parser): (s: string) => string;
    }
}


declare module SVGTypewriter {
    interface Wrapper {
        (s: string, width: number, m: Measurer): string[];
    }
}


declare module SvgTypeWriter {
    class Writer {
    }
}


declare module SVGTypewriter {
    class Measurer {
        constructor(area: D3.Selection);
    }
}
