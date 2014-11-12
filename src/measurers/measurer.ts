///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {
  export class Measurer extends AbstractMeasurer {
    private nonWhitespaceCharacterWidth: number;

    public _addGuards(text: string) {
      return AbstractMeasurer.HEIGHT_TEXT + text + AbstractMeasurer.HEIGHT_TEXT;
    }

    private getNotWhitespaceCharacterWidth() {
      if (this.nonWhitespaceCharacterWidth == null) {
        this.nonWhitespaceCharacterWidth = super.measure(AbstractMeasurer.HEIGHT_TEXT).width;
      }
      return this.nonWhitespaceCharacterWidth;
    }

    public _measureLine(line: string) {
      var measuredLine = this._addGuards(line);
      var measuredLineDimensions = super.measure(measuredLine);
      measuredLineDimensions.width -= 2 * this.getNotWhitespaceCharacterWidth();
      return measuredLineDimensions;
    }

    public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
      if (text == null || text === "") {
        return {width: 0, height: 0};
      }
      var linesDimensions = text.split("\n").map(line => this._measureLine(line));
      return {
          width: d3.max(linesDimensions, dim => dim.width),
          height: d3.sum(linesDimensions, dim => dim.height)
        };
    }
  }
}
