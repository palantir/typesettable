/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

export class StringMethods {
  /**
   * Treat all sequences of consecutive spaces as a single " ".
   */
  public static combineWhitespace(str: string) {
    return str.replace(/[ \t]+/g, " ");
  }

  public static isNotEmptyString(str: string) {
    return str && str.trim() !== "";
  }

  public static trimStart(str: string, splitter?: string) {
    if (!str) {
      return str;
    }

    const chars = str.split("");
    const reduceFunction = splitter ? (s: string) => s.split(splitter).some(StringMethods.isNotEmptyString)
      : StringMethods.isNotEmptyString;
    return chars.reduce((s: string, c: string) => reduceFunction(s + c) ? s + c : s, "");
  }

  public static trimEnd(str: string, c?: string) {
    if (!str) {
      return str;
    }

    let reversedChars = str.split("");
    reversedChars.reverse();
    reversedChars = StringMethods.trimStart(reversedChars.join(""), c).split("");
    reversedChars.reverse();
    return reversedChars.join("");
  }
}
