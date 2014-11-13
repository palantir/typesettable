///<reference path="reference.ts" />

module SVGTypewriter.Wrappers {
  export interface WrappingResult {
    originalText: string;
    wrappedText: string;
    noLines: number;
    noBrokeWords: number;
    truncatedText: string;
  }

  interface IterativeWrappingState {
    wrapping: WrappingResult;
    currentLine: string;
    availableWidth: number;
    availableLines: number;
    canFitText: boolean;
  }

  interface BreakingTokenResult {
    remainingToken: string;
    breakWord: boolean;
    line: string;
  }

  interface EllipsisResult {
    wrappedToken: string;
    remainingToken: string;
  }

  export class Wrapper {
    private _maxLines: number;
    private _textTrimming: string;
    private _allowBreakingWords: boolean;
    private _tokenizer: Utils.Tokenizer;
    public _breakingCharacter: string;

    constructor() {
      this.maxLines(Infinity);
      this.textTrimming("ellipsis");
      this.allowBreakingWords(true);
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

    public wrap(text: string, measurer: Measurers.AbstractMeasurer, width: number, height: number = Infinity): WrappingResult {
      var initialWrappingResult = {
        originalText: text,
        wrappedText: "",
        noLines: 0,
        noBrokeWords: 0,
        truncatedText: ""
      };

      var state = {
        wrapping: initialWrappingResult,
        currentLine: "",
        availableWidth: width,
        availableLines: Math.min(height / measurer.measure().height, this._maxLines),
        canFitText: true
      };

      var lines = text.split("\n");

      return lines.reduce((state: IterativeWrappingState, line: string, i: number) =>
                    this.breakLineToFitWidth(state, line, i !== lines.length - 1, measurer),
                    state
                  ).wrapping;
    }

    private breakLineToFitWidth(state: IterativeWrappingState,
                                line: string,
                                hasNextLine: boolean,
                                measurer: Measurers.AbstractMeasurer): IterativeWrappingState {
      if (!state.canFitText && state.wrapping.truncatedText !== "") {
        state.wrapping.truncatedText += "\n";
      }

      var tokens = this._tokenizer.tokenize(line);
      state = tokens.reduce(
        (state: IterativeWrappingState, token: string) => this.wrapNextToken(token, state, measurer),
        state
      );
      var wrappedText = Utils.Methods.trimEnd(state.currentLine);
      state.wrapping.noLines += +(wrappedText !== "");
      // HACKHACK it needs to be refactored.
      if (state.wrapping.noLines === state.availableLines && this._textTrimming !== "none" && hasNextLine) {
        var ellipsisResult = this.addEllipsis(wrappedText, state.availableWidth, measurer);
        state.wrapping.wrappedText += ellipsisResult.wrappedToken;
        state.wrapping.truncatedText += ellipsisResult.remainingToken;
        state.canFitText = false;
      } else {
        state.wrapping.wrappedText += wrappedText;
      }

      state.currentLine = "\n";

      return state;
    }

    private canFitToken(token: string, width: number, measurer: Measurers.AbstractMeasurer) {
      var possibleBreaks = this._allowBreakingWords ?
                            token.split("").map((c, i) => (i !== token.length - 1) ? c + this._breakingCharacter : c)
                            : [token];
      return possibleBreaks.every(c => measurer.measure(c).width <= width);
    }

    private addEllipsis(line: string, width: number, measurer: Measurers.AbstractMeasurer): EllipsisResult {
      if (this._textTrimming === "none") {
        return {
          wrappedToken: line,
          remainingToken: ""
        };
      }
      var truncatedLine = line.substring(0);
      var lineWidth = measurer.measure(truncatedLine).width;
      var ellipsesWidth = measurer.measure("...").width;

      if (width <= ellipsesWidth) {
        var periodWidth = measurer.measure(".").width;
        var numPeriodsThatFit = Math.floor(width / periodWidth);
        return {
          wrappedToken: "...".substr(0, numPeriodsThatFit),
          remainingToken: line
        };
      }

      while (lineWidth + ellipsesWidth > width) {
        truncatedLine = truncatedLine.substr(0, truncatedLine.length - 1).trim();
        lineWidth = measurer.measure(truncatedLine).width;
      }

      return {
        wrappedToken: truncatedLine + "...",
        remainingToken: Utils.Methods.trimEnd(line.substring(truncatedLine.length), "-").trim()
      };
    }

    private wrapNextToken(token: string, state: IterativeWrappingState, measurer: Measurers.AbstractMeasurer): IterativeWrappingState {
      if (!state.canFitText ||
          state.availableLines === state.wrapping.noLines ||
          !this.canFitToken(token, state.availableWidth, measurer)) {
        if (state.canFitText &&
            state.availableLines !== state.wrapping.noLines &&
            this._allowBreakingWords &&
            this._textTrimming !== "none") {
          var res = this.addEllipsis(state.currentLine + token, state.availableWidth, measurer);
          state.wrapping.wrappedText += res.wrappedToken;
          state.wrapping.truncatedText += res.remainingToken;
          state.wrapping.noBrokeWords += +(res.remainingToken.length < token.length);
          state.wrapping.noLines += +(res.wrappedToken.length > 0);
          state.currentLine = "";
        } else {
          state.wrapping.truncatedText += token;
        }
        state.canFitText = false;
      } else {
        var remainingToken = token;
        var noLines = 0;
        while (remainingToken) {
          var result = this.breakTokenToFitInWidth(remainingToken, state.currentLine, state.availableWidth, measurer);
          state.currentLine = result.line;
          remainingToken = result.remainingToken;
          if (remainingToken != null) {
            state.wrapping.noBrokeWords += +result.breakWord;
            ++state.wrapping.noLines;
            if(state.availableLines === state.wrapping.noLines) {
              var ellipsisResult = this.addEllipsis(state.currentLine, state.availableWidth, measurer);
              state.wrapping.wrappedText += ellipsisResult.wrappedToken;
              state.wrapping.truncatedText += ellipsisResult.remainingToken + remainingToken;
              state.currentLine = "";
              return state;
            } else {
              state.wrapping.wrappedText += state.currentLine + "\n";
              state.currentLine = "";
            }
          }
        }
      }

      return state;
    }

    /**
     * Breaks single token to fit current line. 
     * If token contains only whitespaces then they will not be populated to next line.
     */
    private breakTokenToFitInWidth(token: string,
                                   line: string,
                                   availableWidth: number,
                                   measurer: Measurers.AbstractMeasurer,
                                   breakingCharacter: string = this._breakingCharacter): BreakingTokenResult {
      if (measurer.measure(line + token).width <= availableWidth) {
        return {
          remainingToken: null,
          line: line + token,
          breakWord: false
        };
      }

      if (token.trim() === "") {
        return {
          remainingToken: "",
          line: line,
          breakWord: false
        };
      }

      if (!this._allowBreakingWords) {
        return {
          remainingToken: token,
          line: line,
          breakWord: false
        };
      }

      var fitTokenLength = 0;
      while (fitTokenLength < token.length) {
        if(measurer.measure(line + token.substring(0, fitTokenLength + 1) + breakingCharacter).width <= availableWidth) {
          ++fitTokenLength;
        } else {
          break;
        }
      }

      var suffix = "";
      if (fitTokenLength > 0) {
        suffix = breakingCharacter;
      }

      return {
        remainingToken: token.substring(fitTokenLength),
        line: line + token.substring(0, fitTokenLength) + suffix,
        breakWord: fitTokenLength > 0
      };
    }
  }
}
