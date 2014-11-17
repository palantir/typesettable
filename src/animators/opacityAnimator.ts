///<reference path="../reference.ts" />

module SVGTypewriter.Animators {
  export class OpacityAnimator extends BaseAnimator {
    public animate(selection: D3.Selection): any {
      var attr = Utils.DOM.getBBox(selection);
      var mask = selection.select(".clip-rect");
      mask.attr(attr).attr("opacity", 0);
      (<any>attr).opacity = 1;

      return this._animate(selection, attr);
    }
  }
}
