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
    availableWidth: number;
    remainingWidthInLine: number;
    canFitText: boolean;
  }

  interface BreakingTokenResult {
    brokenToken: string[];
    remainingWidth: number;
  }

  export class Wrapper {
    private _maxLines: number;
    private _textTrimming: string;
    private _allowBreakingWords: boolean;
    private _tokenizer: Utils.Tokenizer;
    public _breakingCharacter: string;
    private _measurer: Measurers.AbstractMeasurer;

    constructor(measurer: Measurers.AbstractMeasurer) {
      this.maxLines(Infinity);
      this.textTrimming("ellipsis");
      this.allowBreakingWords(true);
      this._tokenizer = new Utils.Tokenizer();
      this._breakingCharacter = "-";
      this._measurer = measurer;
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

    public wrap(text: string, width: number, height?: number): WrappingResult {
      return this.breakLineToFitWidth(text, width);
    }

    private breakLineToFitWidth(text: string, availableWidth: number): WrappingResult {
      var tokens = this._tokenizer.tokenize(text);

      var initialWrappingResult = {
        originalText: text,
        wrappedText: "",
        noLines: 1,
        noBrokeWords: 0,
        truncatedText: ""
      };
      var initialState = {
        wrapping: initialWrappingResult,
        remainingWidthInLine: availableWidth,
        availableWidth: availableWidth,
        canFitText: true
      };

      return tokens.reduce((state: IterativeWrappingState , t: string) => {
        if (!state.canFitText) {
          state.wrapping.truncatedText += t;
        } else {
          this.wrapNextToken(t, state);
        }
        return state;
        }, initialState).wrapping;
    }

    private wrapNextToken(token: string, state: IterativeWrappingState) {
      var remainingToken = token;
      var lastRemainingToken: string;
      var remainingWidth = state.remainingWidthInLine;
      var lastRemainingWidth: number;
      var brokeWord = false;
      while(remainingToken && (remainingWidth !== lastRemainingWidth || remainingToken !== lastRemainingToken)) {
        var result = this.breakTokenToFitInWidth(remainingToken, remainingWidth);
        state.wrapping.wrappedText += result.brokenToken[0];
        lastRemainingToken = remainingToken;
        lastRemainingWidth = remainingWidth;
        if (result.brokenToken[0] && result.brokenToken[1]) {
          brokeWord = true;
        }
        remainingToken = result.brokenToken[1] || "";
        remainingWidth = result.remainingWidth || state.availableWidth;
        if(remainingToken) {
          state.wrapping.noLines++;
        }
      }

      state.remainingWidthInLine = remainingWidth;
      state.wrapping.noBrokeWords += +brokeWord;

      if(remainingToken) {
        state.canFitText = false;
        state.wrapping.truncatedText += remainingToken;
      }
    }

    private breakTokenToFitInWidth(token: string, availableWidth: number): BreakingTokenResult {
      var tokenWidth = this._measurer.measure(token).width;
      if (tokenWidth <= availableWidth) {
        return {
          brokenToken: [token],
          remainingWidth: availableWidth - tokenWidth
        };
      }

      if (token.trim() === "") {
        return {
          brokenToken: ["\n"],
          remainingWidth: 0
        };
      }

      var fitToken = token.split("").reduce((curToken: string, c: string) => {
          if(this._measurer.measure(curToken + c + this._breakingCharacter).width <= availableWidth) {
            curToken += c;
          }
          return curToken;
        }, "");
      var remainingToken = token.slice(-fitToken.length);
      if (fitToken.length > 0) {
        fitToken += "-";
      }
      fitToken += "\n";
      return {
        brokenToken: [fitToken + this._breakingCharacter, remainingToken],
        remainingWidth: 0
      };
    }

      // /**
      //  * A paragraph is a string of text containing no newlines.
      //  * Given a paragraph, break it up into lines that are no
      //  * wider than width.  widthMeasure is a function that takes
      //  * text as input, and returns the width of the text in pixels.
      //  */
      // private breakParagraphToFitWidth(text: string, width: number): WrappingResult {
      //   var lines: string[] = [];
      //   var tokens = tokenize(text);
      //   var curLine = "";
      //   var i = 0;
      //   var nextToken: string;
      //   while (nextToken || i < tokens.length) {
      //     if (typeof nextToken === "undefined" || nextToken === null) {
      //       nextToken = tokens[i++];
      //     }
      //     var brokenToken = breakNextTokenToFitInWidth(curLine, nextToken, width, widthMeasure);

      //     var canAdd = brokenToken[0];
      //     var leftOver = brokenToken[1];

      //     if (canAdd !== null) {
      //       curLine += canAdd;
      //     }
      //     nextToken = leftOver;
      //     if (leftOver) {
      //       lines.push(curLine);
      //       curLine = "";
      //     }
      //   }
      //   if (curLine) {
      //     lines.push(curLine);
      //   }
      //   return lines;
      // }
  }
}
