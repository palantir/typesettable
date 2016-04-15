///<reference path="../reference.ts" />

namespace SVGTypewriter.Utils.StringMethods {

  /**
   * Treat all sequences of consecutive whitespace as a single " ".
   */
  export function combineWhitespace(str: string) {
    return str.replace(/\s+/g, " ");
  }

  export function isEmptyString(str: string) {
    return str == null || str.trim() === "";
  }

  export function trimStart(str: string, c: string = " ") {
    if (!str) {
      return str;
    }

    var chars = str.split("");
    var reduceFunction = (s: string) => !isEmptyString(s.split(c)[0]);
    return chars.reduce((s: string, char: string) => reduceFunction(s + char) ? s + char : s, "");
  }

  export function trimEnd(str: string, c?: string) {
    if (!str) {
      return str;
    }

    var reversedChars = str.split("");
    reversedChars.reverse();
    reversedChars = trimStart(reversedChars.join(""), c).split("");
    reversedChars.reverse();
    return reversedChars.join("");
  }
}
