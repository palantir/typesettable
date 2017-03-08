/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IRulerFactoryContext } from "../contexts";
import { AbstractMeasurer, IDimensions, IRuler } from "./abstractMeasurer";

export class Measurer extends AbstractMeasurer {
  private guardWidth: number;
  private useGuards: boolean;

  constructor(ruler: IRuler | IRulerFactoryContext, useGuards: boolean = false) {
    super(ruler);
    this.useGuards = useGuards;
  }

  // Guards assures same line height and width of whitespaces on both ends.
  public _addGuards(text: string) {
    return AbstractMeasurer.HEIGHT_TEXT + text + AbstractMeasurer.HEIGHT_TEXT;
  }

  public _measureLine(line: string, forceGuards: boolean = false): IDimensions {
    const useGuards = this.useGuards || forceGuards || /^[\t ]$/.test(line);
    const measuredLine = useGuards ? this._addGuards(line) : line;
    const measuredLineDimensions = super.measure(measuredLine);
    measuredLineDimensions.width -= useGuards ? (2 * this.getGuardWidth()) : 0;
    return measuredLineDimensions;
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT): IDimensions {
    if (text.trim() === "") {
      return {width: 0, height: 0};
    }

    const linesDimensions = text.trim().split("\n").map((line) => this._measureLine(line));
    return {
        height: linesDimensions.reduce((acc, dim) => acc + dim.height, 0),
        width: linesDimensions.reduce((acc, dim) => Math.max(acc, dim.width), 0),
      };
  }

  private getGuardWidth() {
    if (this.guardWidth == null) {
      this.guardWidth = super.measure().width;
    }
    return this.guardWidth;
  }
}
