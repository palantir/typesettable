/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as d3 from "d3";

import { AnySelection, DOM } from "../utils";

export type EasyType = (normalizedTime: number) => number;

export class BaseAnimator {

  /**
   * The default duration of the animation in milliseconds
   */
  public static DEFAULT_DURATION_MILLISECONDS = 300;

  /**
   * The default easing of the animation
   */
  public static DEFAULT_EASING: EasyType = d3.easeExpOut;

  private _duration: number;
  private _delay: number;
  private _easing: EasyType;
  private _moveX: number;
  private _moveY: number;

  constructor() {
    this.duration(BaseAnimator.DEFAULT_DURATION_MILLISECONDS);
    this.delay(0);
    this.easing(BaseAnimator.DEFAULT_EASING);
    this.moveX(0);
    this.moveY(0);
  }

  public animate(selection: AnySelection): any {
    DOM.transform(selection, this.moveX(), this.moveY());
    const initialTranslate = `translate(0, 0)`;
    return this._animate(selection, { transform: initialTranslate });
  }

  public _animate(selection: AnySelection, attr: any): d3.Transition<any, any, any, any> {
    const transition = selection.transition()
      .ease(this.easing())
      .duration(this.duration())
      .delay(this.delay());
    DOM.applyAttrs(transition, attr);
    return transition;
  }

  public duration(): number;
  public duration(duration: number): BaseAnimator;
  public duration(duration?: number): any {
    if (duration == null) {
      return this._duration;
    } else {
      this._duration = duration;
      return this;
    }
  }

  public moveX(): number;
  public moveX(shift: number): BaseAnimator;
  public moveX(shift?: number): any {
    if (shift == null) {
      return this._moveX;
    } else {
      this._moveX = shift;
      return this;
    }
  }

  public moveY(): number;
  public moveY(shift: number): BaseAnimator;
  public moveY(shift?: number): any {
    if (shift == null) {
      return this._moveY;
    } else {
      this._moveY = shift;
      return this;
    }
  }

  public delay(): number;
  public delay(delay: number): BaseAnimator;
  public delay(delay?: number): any {
    if (delay == null) {
      return this._delay;
    } else {
      this._delay = delay;
      return this;
    }
  }

  public easing(): EasyType;
  public easing(easing: EasyType): BaseAnimator;
  public easing(easing?: EasyType): any {
    if (easing == null) {
      return this._easing;
    } else {
      this._easing = easing;
      return this;
    }
  }
}
