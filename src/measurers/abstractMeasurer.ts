///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {
  /**
   * Dimension of area's BBox.
   */
  export interface Dimensions {
    width: number;
    height: number;
  };

  interface TextMeasurer {
    (text: string): Dimensions;
  }

  export class AbstractMeasurer {
    private textMeasurer: TextMeasurer;
    private defaultText: string;

    public static HEIGHT_TEXT = "bqpdl";

    constructor(area: D3.Selection, className?: string) {
      this.textMeasurer = this.getTextMeasurer(area, className);
    }

    private checkSelectionIsText(d: D3.Selection) {
      return d[0][0].tagName === "text";
    }

    private getTextMeasurer(area: D3.Selection, className: string) {
      if (!this.checkSelectionIsText(area)) {
        var textElement = area.append("text");
        if (className) {
          textElement.classed(className, true);
        }
        textElement.remove();
        return (text: string)  => {
          area.node().appendChild(textElement.node());
          var areaDimension = this.measureBBox(textElement, text);
          textElement.remove();
          return areaDimension;
        };
      } else {
        var parentNode = area.node().parentNode;
        area.remove();
        return (text: string) => {
          parentNode.appendChild(area.node());
          var areaDimension = this.measureBBox(area, text);
          area.remove();
          return areaDimension;
        };
      }
    }

    private measureBBox(d: D3.Selection, text: string) {
      d.text(text);
      var bb = Utils.DOM.getBBox(d);
      return { width: bb.width, height: bb.height };
    }

    public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
      return this.textMeasurer(text);
    }
  }
}
