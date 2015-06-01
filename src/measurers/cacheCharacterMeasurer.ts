///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {

  export class CacheCharacterMeasurer extends CharacterMeasurer {
    private cache: Utils.Cache<Dimensions>;
    constructor(area: d3.Selection<string>, className?: string) {
      super(area, className);
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
}
