/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as Utils from "../utils";

import { IDimensions } from "./abstractMeasurer";
import { CacheCharacterMeasurer } from "./cacheCharacterMeasurer";

export class CacheMeasurer extends CacheCharacterMeasurer {
  private dimCache: Utils.Cache<IDimensions>;

  constructor(area: Utils.AnySelection, className?: string) {
    super(area, className);
    this.dimCache = new Utils.Cache<IDimensions>((s: string) => {
      return this._measureNotFromCache(s);
    });
  }

  public _measureNotFromCache(s: string) {
    return super.measure(s);
  }

  public measure(s: string) {
    return this.dimCache.get(s);
  }

  public reset() {
    this.dimCache.clear();
    super.reset();
  }
}
