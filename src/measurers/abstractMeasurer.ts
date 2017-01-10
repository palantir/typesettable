import * as d3 from "d3";

import * as Utils from "../utils";

/**
 * Dimension of area's BBox.
 */
export interface IDimensions {
  width: number;
  height: number;
};

type ITextMeasurer = (text: string) => IDimensions;

export class AbstractMeasurer {

  public static HEIGHT_TEXT = "bqpdl";

  private textMeasurer: ITextMeasurer;

  constructor(area: d3.Selection<void>, className?: string) {
    this.textMeasurer = this.getTextMeasurer(area, className);
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
    return this.textMeasurer(text);
  }

  private checkSelectionIsText(d: d3.Selection<any>) {
    return (d[0][0] as Element).tagName === "text" || !d.select("text").empty();
  }

  private getTextMeasurer(area: d3.Selection<void>, className: string) {
    if (!this.checkSelectionIsText(area)) {
      const textElement = area.append("text");
      if (className) {
        textElement.classed(className, true);
      }
      textElement.remove();
      return (text: string)  => {
        (area.node() as Element).appendChild(textElement.node() as Element);
        const areaDimension = this.measureBBox(textElement, text);
        textElement.remove();
        return areaDimension;
      };
    } else {
      const parentNode = (area.node() as Element).parentNode;
      let textSelection: d3.Selection<void>;
      if ((area[0][0] as Element).tagName === "text") {
        textSelection = area;
      } else {
        textSelection = area.select("text");
      }
      area.remove();
      return (text: string) => {
        parentNode.appendChild(area.node() as Element);
        const areaDimension = this.measureBBox(textSelection, text);
        area.remove();
        return areaDimension;
      };
    }
  }

  private measureBBox(d: d3.Selection<void>, text: string) {
    d.text(text);
    const bb = Utils.DOM.getBBox(d);
    return { width: bb.width, height: bb.height };
  }
}
