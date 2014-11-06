///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {
  /**
   * Dimension of area's BBox.
   */
  export interface Dimensions {
    width: number;
    height: number;
  };

  export class AbstractMeasurer {
    private measurerArea: D3.Selection;
    private defaultText: string;

    constructor(area: D3.Selection) {
      this.measurerArea = area;
      this.defaultText = area.text();
    }

    public measure(text: string) {
      this.measurerArea.text(text);
      var bb = Utils.DOM.getBBox(this.measurerArea);
      var areaDimension = { width: bb.width, height: bb.height };
      this.measurerArea.text(this.defaultText);
      return areaDimension;
    }
  }
}
