import * as d3 from "d3";
import * as Utils from "../utils";

import { Dimensions } from "./abstractMeasurer";
import { CharacterMeasurer } from "./characterMeasurer";

export class CacheCharacterMeasurer extends CharacterMeasurer {
  private cache: Utils.Cache<Dimensions>;

  constructor(area: d3.Selection<void>, className?: string, useGuards?: boolean) {
    super(area, className, useGuards);
    this.cache = new Utils.Cache<Dimensions>((c: string) => this._measureCharacterNotFromCache(c), Utils.Methods.objEq);
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