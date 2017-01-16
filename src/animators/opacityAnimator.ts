/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

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
