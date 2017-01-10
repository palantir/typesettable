
import * as Utils from "../utils";
import { BaseAnimator } from "./baseAnimator";

export class UnveilAnimator extends BaseAnimator {

  private static SupportedDirections = ["top", "bottom", "left", "right"];
  private _direction: string;

  constructor() {
      super();
      this.direction("bottom");
  }

  public direction(): string;
  public direction(direction: string): UnveilAnimator;
  public direction(direction?: string): any {
    if (direction == null) {
      return this._direction;
    } else {
      if (UnveilAnimator.SupportedDirections.indexOf(direction) === -1) {
        throw new Error("unsupported direction - " + direction);
      }

      this._direction = direction;
      return this;
    }
  }

  public animate(selection: any): any {
    const attr = Utils.DOM.getBBox(selection);
    const mask = selection.select(".clip-rect");
    mask.attr("width", 0);
    mask.attr("height", 0);
    switch (this._direction) {
      case "top":
        mask.attr("y" , attr.y + attr.height);
        mask.attr("x" , attr.x);
        mask.attr("width" , attr.width);
        break;
      case "bottom":
        mask.attr("y" , attr.y);
        mask.attr("x" , attr.x);
        mask.attr("width" , attr.width);
        break;
      case "left":
        mask.attr("y" , attr.y);
        mask.attr("x" , attr.x);
        mask.attr("height" , attr.height);
        break;
      case "right":
        mask.attr("y" , attr.y);
        mask.attr("x" , attr.x + attr.width);
        mask.attr("height" , attr.height);
        break;
      default:
        break;
    }

    this._animate(mask, attr);
    return super.animate(selection);
  }
}
