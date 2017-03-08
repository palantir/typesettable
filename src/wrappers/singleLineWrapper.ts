/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import * as Measurers from "../measurers";
import { IWrappingResult, Wrapper } from "./wrapper";

export class SingleLineWrapper extends Wrapper {
  private static NO_WRAP_ITERATIONS = 5;

  public wrap(
      text: string,
      measurer: Measurers.AbstractMeasurer,
      width: number,
      height: number = Infinity): IWrappingResult {

    const lines = text.split("\n");

    if (lines.length > 1) {
      throw new Error("SingleLineWrapper is designed to work only on single line");
    }

    const wrapFN = (w: number) => super.wrap(text, measurer, w, height);

    let result = wrapFN(width);
    if (result.noLines < 2) {
      return result;
    }

    let left = 0;
    let right = width;

    for (let i = 0; i < SingleLineWrapper.NO_WRAP_ITERATIONS && right > left; ++i) {
      const currentWidth = (right + left) / 2;
      const currentResult = wrapFN(currentWidth);
      if (this.areSameResults(result, currentResult)) {
        right = currentWidth;
        result = currentResult;
      } else {
        left = currentWidth;
      }
    }

    return result;
  }

  private areSameResults(one: IWrappingResult, two: IWrappingResult) {
    return one.noLines === two.noLines && one.truncatedText === two.truncatedText;
  }
}
