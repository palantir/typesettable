///<reference path="reference.ts" />

module SVGTypewriter {
  export module Parsers {
    export interface Parser {
      (text: string) => string;
    }
  }
}