///<reference path="../reference.ts" />

module SVGTypewriter.Animators {
  export class OpacityAnimator extends BaseAnimator {
    public animate(selection: D3.Selection): any {
      debugger;
      var area = selection.select(".text-area");
      area.attr("opacity", 0);
      var attr = {
        opacity: 1
      };

      return this._animate(area, attr);
    }
  }
}
