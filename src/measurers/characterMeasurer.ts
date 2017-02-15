/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { max, sum } from "d3-array";

import { IDimensions } from "./abstractMeasurer";
import { Measurer } from "./measurer";

export class CharacterMeasurer extends Measurer {

  public _measureCharacter(c: string) {
    return super._measureLine(c);
  }

  public _measureLine(line: string): IDimensions {
    const charactersDimensions = line.split("").map((c) => this._measureCharacter(c));
    return {
      height: max(charactersDimensions, (dim) => dim.height),
      width: sum(charactersDimensions, (dim) => dim.width),
    };
  }
}
