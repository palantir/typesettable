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

    constructor(measurer: Measurers.AbstractMeasurer) {
      this.maxLines(Infinity);
      this.textTrimming("ellipsis");
      this.allowBreakingWords(true);
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
  }
}
