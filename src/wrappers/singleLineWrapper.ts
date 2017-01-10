import * as Measurers from "../measurers";
import { Wrapper, WrappingResult } from "./wrapper";

export class SingleLineWrapper extends Wrapper {
  private static NO_WRAP_ITERATIONS = 5;

  public wrap(text: string, measurer: Measurers.AbstractMeasurer, width: number, height: number = Infinity): WrappingResult {
    var lines = text.split("\n");

    if (lines.length > 1) {
      throw new Error("SingleLineWrapper is designed to work only on single line");
    }

    var wrapFN = (w: number) => super.wrap(text, measurer, w, height);

    var result = wrapFN(width);
    if (result.noLines < 2) {
      return result;
    }

    var left = 0;
    var right = width;

    for (var i = 0; i < SingleLineWrapper.NO_WRAP_ITERATIONS && right > left; ++i) {
      var currentWidth = (right + left) / 2;
      var currentResult = wrapFN(currentWidth);
      if (this.areSameResults(result, currentResult)) {
        right = currentWidth;
        result = currentResult;
      } else {
        left = currentWidth;
      }
    }

    return result;
  }

  private areSameResults(one: WrappingResult, two: WrappingResult) {
    return one.noLines === two.noLines && one.truncatedText === two.truncatedText;
  }
}
