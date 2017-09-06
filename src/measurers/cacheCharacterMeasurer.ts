/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */

import { IRulerFactoryContext } from "../contexts";
import { Cache } from "../utils";
import { IDimensions, IRuler } from "./abstractMeasurer";
import { CharacterMeasurer } from "./characterMeasurer";

export class CacheCharacterMeasurer extends CharacterMeasurer {
  private cache: Cache<IDimensions>;

  constructor(ruler: IRuler | IRulerFactoryContext, useGuards?: boolean) {
    super(ruler, useGuards);
    this.cache = new Cache<IDimensions>((c: string) => {
      return this._measureCharacterNotFromCache(c);
    });
  }

  public _measureCharacterNotFromCache(c: string) {
    return super._measureCharacter(c);
  }

  public _measureCharacter(c: string) {
    return this.cache.get(c);
  }

  public reset() {
    this.cache.clear();
  }
}
