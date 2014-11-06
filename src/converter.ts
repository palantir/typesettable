///<reference path="reference.ts" />

module SVGTypewriter {
  export module Converters {
    export interface Converter {
      (text: string): string;
    }

    export function ident() {
      return (s: string) => s;
    }

    /**
     * @return {Parser} A converter that will treat all 
     * sequences of consecutive whitespace as a single " ".
     */
    export function combineWhitespace(con: Converter) {
      return (s: string) => con(s.replace(/\s+/g, " "));
    }
  }
}
