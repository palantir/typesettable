/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

export class Tokenizer {
  private WordDividerRegExp = new RegExp("\\W");
  private WhitespaceRegExp = new RegExp("\\s");

  public tokenize(line: string): string[] {
    return line.split("").reduce(
      (tokens: string[], c: string) => {
        return tokens.slice(0, -1).concat(this.shouldCreateNewToken(tokens[tokens.length - 1], c));
      }, [""]);
  }

  private shouldCreateNewToken(token: string, newCharacter: string) {
    if (!token) {
      return [newCharacter];
    }
    const lastCharacter = token[token.length - 1];
    if (this.WhitespaceRegExp.test(lastCharacter) && this.WhitespaceRegExp.test(newCharacter)) {
      return [token + newCharacter];
    } else if (this.WhitespaceRegExp.test(lastCharacter) || this.WhitespaceRegExp.test(newCharacter)) {
      return [token, newCharacter];
    } else if (!(this.WordDividerRegExp.test(lastCharacter))) {
      return [token + newCharacter];
    } else if (lastCharacter === newCharacter) {
      return [token + newCharacter];
    } else {
      return [token, newCharacter];
    }
  }
}
