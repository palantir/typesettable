///<reference path="../reference.ts" />

module SVGTypewriter.Animators {
  export class OpacityAnimator extends BaseAnimator {
    public animate(selection: D3.Selection): any {
      var area = selection.select(".text-area");
      area.attr("opacity", 0);
      var attr = {
        opacity: 1
      };

      this._animate(area, attr);
      return super.animate(selection);
    }
  }
}
