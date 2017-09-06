/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */
/* istanbul ignore next */

import { IDimensions } from "./abstractMeasurer";
import { Measurer } from "./measurer";

export class CharacterMeasurer extends Measurer {

  public _measureCharacter(c: string) {
    return super._measureLine(c);
  }

  public _measureLine(line: string): IDimensions {
    const charactersDimensions = line.split("").map((c) => this._measureCharacter(c));
    return {
      height: charactersDimensions.reduce((acc, dim) => Math.max(acc, dim.height), 0),
      width: charactersDimensions.reduce((acc, dim) => acc + dim.width, 0),
    };
  }
}
