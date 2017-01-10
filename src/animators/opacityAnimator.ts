import * as d3 from "d3";

import { BaseAnimator } from "./baseAnimator";

export class OpacityAnimator extends BaseAnimator {
  public animate(selection: d3.Selection<any>): any {
    const area = selection.select(".text-area");
    area.attr("opacity", 0);
    const attr = {
      opacity: 1,
    };

    this._animate(area, attr);
    return super.animate(selection);
  }
}
