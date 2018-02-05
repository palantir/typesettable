/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */

import { IRulerFactoryContext } from "../contexts";
import { Cache } from "../utils";
import { AbstractMeasurer, IDimensions, IRuler } from "./abstractMeasurer";
import { CacheCharacterMeasurer } from "./cacheCharacterMeasurer";

export class CacheMeasurer extends CacheCharacterMeasurer {
  private dimCache: Cache<IDimensions>;

  constructor(ruler: IRuler | IRulerFactoryContext) {
    super(ruler);
    this.dimCache = new Cache<IDimensions>((s: string) => {
      return this._measureNotFromCache(s);
    });
  }

  public _measureNotFromCache(s: string) {
    return super.measure(s);
  }

  public measure(s: string = AbstractMeasurer.HEIGHT_TEXT) {
    return this.dimCache.get(s);
  }

  public reset() {
    this.dimCache.clear();
    super.reset();
  }
}
