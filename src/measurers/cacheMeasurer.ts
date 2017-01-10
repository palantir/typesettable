import * as d3 from "d3";
import * as Utils from "../utils";

import { IDimensions } from "./abstractMeasurer";
import { CacheCharacterMeasurer } from "./cacheCharacterMeasurer";

export class CacheMeasurer extends CacheCharacterMeasurer {
  private dimCache: Utils.Cache<IDimensions>;

  constructor(area: d3.Selection<void>, className?: string) {
    super(area, className);
    this.dimCache = new Utils.Cache<IDimensions>((s: string) => {
      return this._measureNotFromCache(s);
    }, Utils.Methods.objEq);
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
