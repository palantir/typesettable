import * as d3 from "d3";

import * as Utils from "../utils";

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

  public static HEIGHT_TEXT = "bqpdl";

  constructor(area: d3.Selection<void>, className?: string) {
    this.textMeasurer = this.getTextMeasurer(area, className);
  }

  private checkSelectionIsText(d: d3.Selection<any>) {
    return (<Element> d[0][0]).tagName === "text" || !d.select("text").empty();
  }

  private getTextMeasurer(area: d3.Selection<void>, className: string) {
    if (!this.checkSelectionIsText(area)) {
      var textElement = area.append("text");
      if (className) {
        textElement.classed(className, true);
      }
      textElement.remove();
      return (text: string)  => {
        (<Element> area.node()).appendChild(<Element> textElement.node());
        var areaDimension = this.measureBBox(textElement, text);
        textElement.remove();
        return areaDimension;
      };
    } else {
      var parentNode = (<Element> area.node()).parentNode;
      var textSelection: d3.Selection<void>;
      if ((<Element> area[0][0]).tagName === "text") {
        textSelection = area;
      } else {
        textSelection = area.select("text");
      }
      area.remove();
      return (text: string) => {
        parentNode.appendChild(<Element> area.node());
        var areaDimension = this.measureBBox(textSelection, text);
        area.remove();
        return areaDimension;
      };
    }
  }

  private measureBBox(d: d3.Selection<void>, text: string) {
    d.text(text);
    var bb = Utils.DOM.getBBox(d);
    return { width: bb.width, height: bb.height };
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
    return this.textMeasurer(text);
  }
}

