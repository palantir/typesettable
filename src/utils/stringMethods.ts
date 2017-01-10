export namespace StringMethods {
  /**
   * Treat all sequences of consecutive whitespace as a single " ".
   */
  export function combineWhitespace(str: string) {
    return str.replace(/\s+/g, " ");
  }

  export function isNotEmptyString(str: string) {
    return str && str.trim() !== "";
  }

  export function trimStart(str: string, c?: string) {
    if (!str) {
      return str;
    }

    var chars = str.split("");
    var reduceFunction = c ? (s: string) => s.split(c).some(isNotEmptyString) : isNotEmptyString;
    return chars.reduce((s: string, c : string) => reduceFunction(s + c) ? s + c : s, "");
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
