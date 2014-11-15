///<reference path="../reference.ts" />
module SVGTypewriter.Animators {
  export interface AnimatorAttribute {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export class BaseAnimator {

    /**
     * The default duration of the animation in milliseconds
     */
    public static DEFAULT_DURATION_MILLISECONDS = 300;

    /**
     * The default easing of the animation
     */
    public static DEFAULT_EASING = "exp-out";

    private static SupportedDirections = ["top", "bottom", "left", "right"];

    private _duration: number;
    private _delay: number;
    private _easing: string;
    private _direction: string;

    constructor() {
      this.duration(BaseAnimator.DEFAULT_DURATION_MILLISECONDS);
      this.delay(0);
      this.easing(BaseAnimator.DEFAULT_EASING);
      this.direction("bottom");
    }

    public animate(selection: any): any {
      var attr = Utils.DOM.getBBox(selection);
      var mask = selection.append("mask").append("rect");
      mask.attr("id", "maskurl");
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
          mask.attr("width" , attr.height);
          break;

      }
      selection.select(".text-area").style("width", 20);
      return mask.transition()
        .ease(this.easing())
        .duration(this.duration())
        .delay(this.delay())
        .attr(attr);
    }

    public duration(): number;
    public duration(duration: number): BaseAnimator;
    public duration(duration?: number): any{
      if (duration == null) {
        return this._duration;
      } else {
        this._duration = duration;
        return this;
      }
    }

    public delay(): number;
    public delay(delay: number): BaseAnimator;
    public delay(delay?: number): any{
      if (delay == null) {
        return this._delay;
      } else {
        this._delay = delay;
        return this;
      }
    }

    public easing(): string;
    public easing(easing: string): BaseAnimator;
    public easing(easing?: string): any{
      if (easing == null) {
        return this._easing;
      } else {
        this._easing = easing;
        return this;
      }
    }

    public direction(): string;
    public direction(direction: string): BaseAnimator;
    public direction(direction?: string): any{
      if (direction == null) {
        return this._direction;
      } else {
        if (BaseAnimator.SupportedDirections.indexOf(direction) === -1) {
          throw new Error("unsupported direction - " + direction);
        }

        this._direction = direction;
        return this;
      }
    }
  }
}
