
import * as d3 from "d3";

import { AbstractMeasurer, IDimensions } from "./abstractMeasurer";

export class Measurer extends AbstractMeasurer {
  private guardWidth: number;
  private useGuards: boolean;

  constructor(area: d3.Selection<void>, className: string = null, useGuards: boolean = false) {
    super(area, className);
    this.useGuards = useGuards;
  }

  // Guards assures same line height and width of whitespaces on both ends.
  public _addGuards(text: string) {
    return AbstractMeasurer.HEIGHT_TEXT + text + AbstractMeasurer.HEIGHT_TEXT;
  }

  public _measureLine(line: string): IDimensions {
    const measuredLine = this.useGuards ? this._addGuards(line) : line;
    const measuredLineDimensions = super.measure(measuredLine);
    measuredLineDimensions.width -= this.useGuards ? (2 * this.getGuardWidth()) : 0;
    return measuredLineDimensions;
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT): IDimensions {
    if (text.trim() === "") {
      return {width: 0, height: 0};
    }
    const linesDimensions = text.trim().split("\n").map((line) => this._measureLine(line));
    return {
        height: d3.sum(linesDimensions, (dim) => dim.height),
        width: d3.max(linesDimensions, (dim) => dim.width),
      };
  }

  private getGuardWidth() {
    if (this.guardWidth == null) {
      this.guardWidth = super.measure().width;
    }
    return this.guardWidth;
  }
}
