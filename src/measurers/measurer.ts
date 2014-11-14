///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {
  export class Measurer extends AbstractMeasurer {
    private guardWidth: number;

    // Guards assures same line height and width of whitespaces on both ends.
    public _addGuards(text: string) {
      return AbstractMeasurer.HEIGHT_TEXT + text + AbstractMeasurer.HEIGHT_TEXT;
    }

    private getGuardWidth() {
      if (this.guardWidth == null) {
        this.guardWidth = super.measure().width;
      }
      return this.guardWidth;
    }

    public _measureLine(line: string) {
      var measuredLine = this._addGuards(line);
      var measuredLineDimensions = super.measure(measuredLine);
      measuredLineDimensions.width -= 2 * this.getGuardWidth();
      return measuredLineDimensions;
    }

    public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
      if (text.trim() === "") {
        return {width: 0, height: 0};
      }
      var linesDimensions = text.trim().split("\n").map(line => this._measureLine(line));
      return {
          width: d3.max(linesDimensions, dim => dim.width),
          height: d3.sum(linesDimensions, dim => dim.height)
        };
    }
  }
}
