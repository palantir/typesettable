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

      return lines.map((line, i) => i !== lines.length - 1 ? line + "\n" : line)
                  .reduce((state: IterativeWrappingState, line: string) =>
                    this.breakLineToFitWidth(state, line, measurer),
                    state
                  ).wrapping;
    }

    private breakLineToFitWidth(state: IterativeWrappingState,
                                line: string,
                                measurer: Measurers.AbstractMeasurer): IterativeWrappingState {
      var tokens = this._tokenizer.tokenize(line);
      state = tokens.reduce(
        (state: IterativeWrappingState, token: string) =>
          state.canFitText ? this.wrapNextToken(token, state, measurer) : this.truncateNextToken(token, state),
        state
      );
      state.wrapping.wrappedText += state.currentLine;
      state.wrapping.noLines += +(state.currentLine !== "");
      state.currentLine = "";
      return state;
    }

    private truncateNextToken(token: string, state: IterativeWrappingState) {
      state.wrapping.truncatedText += token;
      return state;
    }

    private canFitToken(token: string, width: number, measurer: Measurers.AbstractMeasurer) {
      var possibleBreaks = this._allowBreakingWords ?
                            token.split("").map((c, i) => (i !== token.length - 1) ? c + this._breakingCharacter : c)
                            : [token];
      return possibleBreaks.every(c => measurer.measure(c).width <= width);
    }

    private addEllipsis(line: string, width: number, measurer: Measurers.AbstractMeasurer) {
      return line;
    }

    private wrapNextToken(token: string, state: IterativeWrappingState, measurer: Measurers.AbstractMeasurer) {
      if (state.availableLines === 0 || !this.canFitToken(token, state.availableWidth, measurer)) {
        state.canFitText = false;
        state.wrapping.truncatedText += token;
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
            --state.availableLines;
            if(state.availableLines === 0) {
              state.wrapping.wrappedText += this.addEllipsis(state.currentLine, state.availableWidth, measurer);
              state.currentLine = "";
              state.wrapping.truncatedText += remainingToken;
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
                                   measurer: Measurers.AbstractMeasurer): BreakingTokenResult {
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
        if(measurer.measure(line + token.substring(0, fitTokenLength + 1) + this._breakingCharacter).width <= availableWidth) {
          ++fitTokenLength;
        } else {
          break;
        }
      }

      var suffix = "";
      if (fitTokenLength > 0) {
        suffix = "-";
      }

      return {
        remainingToken: token.substring(fitTokenLength),
        line: line + token.substring(0, fitTokenLength) + suffix,
        breakWord: fitTokenLength > 0
      };
    }
  }
}
