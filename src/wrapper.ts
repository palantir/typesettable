///<reference path="reference.ts" />

module SVGTypewriter.Wrappers {
  export interface WrappingResult {
    originalText: string;
    wrapperdText: string;
    noLines: number;
    noBrokeWords: number;
    truncatedText: string;
  }

  export class Wrapper {
    private _maxLines: number;
    private _textTrimming: string;
    private _allowBreakingWords: boolean;
    private _tokenizer: Utils.Tokenizer;

    constructor(measurer: Measurers.AbstractMeasurer) {
      this.maxLines(Infinity);
      this.textTrimming("ellipsis");
      this.allowBreakingWords(true);
      this._tokenizer = new Utils.Tokenizer();
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

    public wrap(s: string, width: number, height?: number): WrappingResult {
      return null;
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
