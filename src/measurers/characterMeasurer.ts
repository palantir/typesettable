import * as d3 from "d3";

import { IDimensions } from "./abstractMeasurer";
import { Measurer } from "./measurer";

export class CharacterMeasurer extends Measurer {

  public _measureCharacter(c: string) {
    return super._measureLine(c);
  }

  public _measureLine(line: string): IDimensions {
    const charactersDimensions = line.split("").map((c) => this._measureCharacter(c));
    return {
      height: d3.max(charactersDimensions, (dim) => dim.height),
      width: d3.sum(charactersDimensions, (dim) => dim.width),
    };
  }
}
