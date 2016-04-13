///<reference path="../reference.ts" />
namespace SVGTypewriter.Animators {
  export class BaseAnimator {

    /**
     * The default duration of the animation in milliseconds
     */
    public static DEFAULT_DURATION_MILLISECONDS = 300;

    /**
     * The default easing of the animation
     */
    public static DEFAULT_EASING = "exp-out";

    private _duration: number;
    private _delay: number;
    private _easing: string;
    private _moveX: number;
    private _moveY: number;

    constructor() {
      this.duration(BaseAnimator.DEFAULT_DURATION_MILLISECONDS);
      this.delay(0);
      this.easing(BaseAnimator.DEFAULT_EASING);
      this.moveX(0);
      this.moveY(0);
    }

    public animate(selection: d3.Selection<any>): any {
     var xForm = d3.transform("");
     xForm.translate = [this.moveX(), this.moveY()];
     selection.attr("transform", xForm.toString());
     xForm.translate = [0, 0];
     return this._animate(selection, { transform: xForm.toString() });
    }

    public _animate(selection: d3.Selection<any>, attr: any) {
      return selection.transition()
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

    public moveX(): number;
    public moveX(shift: number): BaseAnimator;
    public moveX(shift?: number): any{
      if (shift == null) {
        return this._moveX;
      } else {
        this._moveX = shift;
        return this;
      }
    }

    public moveY(): number;
    public moveY(shift: number): BaseAnimator;
    public moveY(shift?: number): any{
      if (shift == null) {
        return this._moveY;
      } else {
        this._moveY = shift;
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
  }
}
