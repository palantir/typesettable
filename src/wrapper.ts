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

    public wrap(text: string, measurer: Measurers.AbstractMeasurer, width: number, height?: number): WrappingResult {
      this._measurer = measurer;
      return this.breakLineToFitWidth(text, width);
    }

    private breakLineToFitWidth(text: string, availableWidth: number): WrappingResult {
      var tokens = this._tokenizer.tokenize(text);

      var initialWrappingResult = {
        originalText: text,
        wrappedText: "",
        noLines: 0,
        noBrokeWords: 0,
        truncatedText: ""
      };
      var state = {
        wrapping: initialWrappingResult,
        remainingWidthInLine: availableWidth,
        availableWidth: availableWidth,
        canFitText: true
      };

      for(var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        if(state.canFitText) {
          this.wrapNextToken(token, state);
        } else {
          state.wrapping.truncatedText += token;
        }
      }
      return state.wrapping;
    }

    private wrapNextToken(token: string, state: IterativeWrappingState) {
      var remainingToken = token;
      var lastRemainingToken: string;
      var remainingWidth = state.remainingWidthInLine;
      var lastRemainingWidth: number;
      var brokeWord = false;
      var wrappedText = "";
      var noLines = 0;
      while(remainingToken && (remainingWidth !== lastRemainingWidth || remainingToken !== lastRemainingToken)) {
        var result = this.breakTokenToFitInWidth(remainingToken, remainingWidth);
        wrappedText += result.brokenToken[0];
        lastRemainingToken = remainingToken;
        lastRemainingWidth = remainingWidth;
        if (Utils.Methods.isNotEmptyString(result.brokenToken[0]) && Utils.Methods.isNotEmptyString(result.brokenToken[1])) {
          brokeWord = true;
        }
        remainingToken = result.brokenToken[1];
        remainingWidth = result.remainingWidth || state.availableWidth;
        if(remainingToken !== undefined) {
          ++noLines;
        }
      }

      if (remainingToken) {
        state.canFitText = false;
        state.wrapping.truncatedText += token;
      } else {
        if (state.wrapping.noLines === 0) {
          ++state.wrapping.noLines;
        }
        state.remainingWidthInLine = remainingWidth;
        state.wrapping.noBrokeWords += +brokeWord;
        state.wrapping.wrappedText += wrappedText;
        state.wrapping.noLines += noLines;
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
          brokenToken: ["\n", ""],
          remainingWidth: 0
        };
      }

      var fitToken = "";
      var tokenLetters = token.split("");
      for(var i = 0; i < tokenLetters.length; ++i) {
        var currentLetter = tokenLetters[i];
        if(this._measurer.measure(fitToken + currentLetter + this._breakingCharacter).width <= availableWidth) {
          fitToken += currentLetter;
        } else {
          break;
        }
      }
      var remainingToken = token.slice(fitToken.length);
      if (fitToken.length > 0) {
        fitToken += "-";
      }
      fitToken += "\n";
      return {
        brokenToken: [fitToken, remainingToken],
        remainingWidth: 0
      };
    }
  }
}
