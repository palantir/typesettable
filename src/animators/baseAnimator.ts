///<reference path="../reference.ts" />
module SVGTypewriter.Animators {
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



    constructor() {
      this.duration(BaseAnimator.DEFAULT_DURATION_MILLISECONDS);
      this.delay(0);
      this.easing(BaseAnimator.DEFAULT_EASING);
    }

    public animate(selection: D3.Selection): any {
     return this._animate(selection.select(".clip-rect"), Utils.DOM.getBBox(selection));
    }

    public _animate(selection: D3.Selection, attr: any) {
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
