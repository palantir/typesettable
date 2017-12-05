/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import * as Measurers from "../measurers";
import * as Utils from "../utils";

export interface IWrappingResult {
  originalText: string;
  wrappedText: string;
  noLines: number;
  noBrokeWords: number;
  truncatedText: string;
}

interface IIterativeWrappingState {
  wrapping: IWrappingResult;
  currentLine: string;
  availableWidth: number;
  availableLines: number;
  canFitText: boolean;
}

interface IBreakingTokenResult {
  remainingToken: string;
  breakWord: boolean;
  line: string;
}

interface IEllipsisResult {
  wrappedToken: string;
  remainingToken: string;
}

export class Wrapper {
  public _breakingCharacter: string;

  private _maxLines: number;
  private _textTrimming: string;
  private _allowBreakingWords: boolean;
  private _tokenizer: Utils.Tokenizer;

  constructor() {
    this.maxLines(Infinity);
    this.textTrimming("ellipsis");
    this.allowBreakingWords(false);
    this._tokenizer = new Utils.Tokenizer();
    this._breakingCharacter = "-";
  }

  public maxLines(): number;
  public maxLines(noLines: number): Wrapper;
  public maxLines(noLines?: any): any {
    if (noLines == null) {
      return this._maxLines;
    } else {
      this._maxLines = noLines;
      return this;
    }
  }

  public textTrimming(): string;
  public textTrimming(option: string): Wrapper;
  public textTrimming(option?: any): any {
    if (option == null) {
      return this._textTrimming;
    } else {
      if (option !== "ellipsis" && option !== "none") {
        throw new Error(option + " - unsupported text trimming option.");
      }
      this._textTrimming = option;
      return this;
    }
  }

  public allowBreakingWords(): boolean;
  public allowBreakingWords(allow: boolean): Wrapper;
  public allowBreakingWords(allow?: any): any {
    if (allow == null) {
      return this._allowBreakingWords;
    } else {
      this._allowBreakingWords = allow;
      return this;
    }
  }

  public wrap(
      text: string,
      measurer: Measurers.AbstractMeasurer,
      width: number,
      height: number = Infinity): IWrappingResult {

    const initialWrappingResult = {
      noBrokeWords: 0,
      noLines: 0,
      originalText: text,
      truncatedText: "",
      wrappedText: "",
    };

    const state = {
      availableLines: Math.min(Math.floor(height / measurer.measure().height), this._maxLines),
      availableWidth: width,
      canFitText: true,
      currentLine: "",
      wrapping: initialWrappingResult,
    };

    const lines = text.split("\n");

    return lines.reduce((s: IIterativeWrappingState, line: string, i: number) => {
        return this.breakLineToFitWidth(s, line, i !== lines.length - 1, measurer);
      }, state).wrapping;
  }

  private breakLineToFitWidth(state: IIterativeWrappingState,
                              line: string,
                              hasNextLine: boolean,
                              measurer: Measurers.AbstractMeasurer): IIterativeWrappingState {
    if (!state.canFitText && state.wrapping.truncatedText !== "") {
      state.wrapping.truncatedText += "\n";
    }

    const tokens = this._tokenizer.tokenize(line);
    state = tokens.reduce(
      (s: IIterativeWrappingState, token: string) => {
        return this.wrapNextToken(token, s, measurer);
      }, state);

    const wrappedText = Utils.StringMethods.trimEnd(state.currentLine);
    state.wrapping.noLines += +(wrappedText !== "");

    if (state.wrapping.noLines === state.availableLines && this._textTrimming !== "none" && hasNextLine) {
      // Note: no need to add more ellipses, they were added in `wrapNextToken`
      state.canFitText = false;
    } else {
      state.wrapping.wrappedText += wrappedText;
    }

    state.currentLine = "\n";

    return state;
  }

  private canFitToken(token: string, width: number, measurer: Measurers.AbstractMeasurer) {
    const possibleBreaks = token.split("").map((c, i) => (i !== token.length - 1) ? c + this._breakingCharacter : c);
    return (measurer.measure(token).width <= width) || possibleBreaks.every((c) => measurer.measure(c).width <= width);
  }

  private addEllipsis(line: string, width: number, measurer: Measurers.AbstractMeasurer): IEllipsisResult {
    if (this._textTrimming === "none") {
      return {
        remainingToken: "",
        wrappedToken: line,
      };
    }
    let truncatedLine = line.substring(0).trim();
    let lineWidth = measurer.measure(truncatedLine).width;

    const ellipsesWidth = measurer.measure("...").width;
    const prefix = (line.length > 0 && line[0] === "\n") ? "\n" : "";

    if (width <= ellipsesWidth) {
      const periodWidth = ellipsesWidth / 3;
      const numPeriodsThatFit = Math.floor(width / periodWidth);
      return {
        remainingToken: line,
        wrappedToken: prefix + "...".substr(0, numPeriodsThatFit),
      };
    }

    while (lineWidth + ellipsesWidth > width) {
      truncatedLine = Utils.StringMethods.trimEnd(truncatedLine.substr(0, truncatedLine.length - 1));
      lineWidth = measurer.measure(truncatedLine).width;
    }

    return {
      remainingToken: Utils.StringMethods.trimEnd(line.substring(truncatedLine.length), "-").trim(),
      wrappedToken: prefix + truncatedLine + "...",
    };
  }

  private wrapNextToken(
      token: string,
      state: IIterativeWrappingState,
      measurer: Measurers.AbstractMeasurer): IIterativeWrappingState {

    if (!state.canFitText ||
        state.availableLines === state.wrapping.noLines ||
        !this.canFitToken(token, state.availableWidth, measurer)) {
      return this.finishWrapping(token, state, measurer);
    }

    let remainingToken = token;
    while (remainingToken) {
      const result = this.breakTokenToFitInWidth(remainingToken, state.currentLine, state.availableWidth, measurer);
      state.currentLine = result.line;
      remainingToken = result.remainingToken;
      if (remainingToken != null) {
        state.wrapping.noBrokeWords += +result.breakWord;
        ++state.wrapping.noLines;
        if (state.availableLines === state.wrapping.noLines) {
          const ellipsisResult = this.addEllipsis(state.currentLine, state.availableWidth, measurer);
          state.wrapping.wrappedText += ellipsisResult.wrappedToken;
          state.wrapping.truncatedText += ellipsisResult.remainingToken + remainingToken;
          state.currentLine = "\n";
          return state;
        } else {
          state.wrapping.wrappedText += Utils.StringMethods.trimEnd(state.currentLine);
          state.currentLine = "\n";
        }
      }
    }

    return state;
  }

  private finishWrapping(token: string, state: IIterativeWrappingState, measurer: Measurers.AbstractMeasurer) {
    // Token is really long, but we have a space to put part of the word.
    if (state.canFitText &&
        state.availableLines !== state.wrapping.noLines &&
        this._textTrimming !== "none") {
      const res = this.addEllipsis(state.currentLine + token, state.availableWidth, measurer);
      state.wrapping.wrappedText += res.wrappedToken;
      state.wrapping.truncatedText += res.remainingToken;
      state.wrapping.noBrokeWords += +(res.remainingToken.length < token.length);
      state.wrapping.noLines += +(res.wrappedToken.length > 0);
      state.currentLine = "";
    } else {
      state.wrapping.truncatedText += token;
    }

    state.canFitText = false;

    return state;
  }

  /**
   * Breaks single token to fit current line.
   * If token contains only whitespaces then they will not be populated to next line.
   */
  private breakTokenToFitInWidth(
      token: string,
      line: string,
      availableWidth: number,
      measurer: Measurers.AbstractMeasurer,
      breakingCharacter: string = this._breakingCharacter): IBreakingTokenResult {

    if (measurer.measure(line + token).width <= availableWidth) {
      return {
        breakWord: false,
        line: line + token,
        remainingToken: null,
      };
    }

    if (token.trim() === "") {
      return {
        breakWord: false,
        line,
        remainingToken: "",
      };
    }

    // if we don't allow breaking words AND the token isn't the only thing on the current line.
    if (!this._allowBreakingWords && line.trim() !== "") {
      return {
        breakWord: false,
        line,
        remainingToken: token,
      };
    }

    let fitTokenLength = 0;
    while (fitTokenLength < token.length) {
      if (measurer.measure(line + token.substring(0, fitTokenLength + 1) + breakingCharacter).width <= availableWidth) {
        ++fitTokenLength;
      } else {
        break;
      }
    }

    let suffix = "";
    if (fitTokenLength > 0) {
      suffix = breakingCharacter;
    }

    return {
      breakWord: fitTokenLength > 0,
      line: line + token.substring(0, fitTokenLength) + suffix,
      remainingToken: token.substring(fitTokenLength),
    };
  }
}
