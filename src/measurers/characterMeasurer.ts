import * as d3 from "d3";

import { Dimensions } from "./abstractMeasurer";
import { Measurer } from "./measurer";

export class CharacterMeasurer extends Measurer {

  public _measureCharacter(c: string) {
    return super._measureLine(c);
  }

  public _measureLine(line: string): Dimensions {
    var charactersDimensions = line.split("").map(c => this._measureCharacter(c));
    return {
      width: d3.sum(charactersDimensions, dim => dim.width),
      height: d3.max(charactersDimensions, dim => dim.height),
    };
  }
}