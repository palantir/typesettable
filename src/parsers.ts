///<reference path="reference.ts" />

module SVGTypewriter {
  export module Parsers {
    // I think this is an inappropriate name
    export interface Parser {
      (text: string): string;
    }

    export function ident() {
      return (s: string) => s;
    }

    /**
     * @return {Parser} A test parser that will treat all
     * sequences of consecutive whitespace as a single " ".
     */
    export function combineWhitespace(pr: Parser) {
      return (s: string) => pr(s.replace(/\s+/g, " "));
    }
  }
}
