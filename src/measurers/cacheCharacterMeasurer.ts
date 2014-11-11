///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {

  export class CacheCharacterMeasurer extends CharacterMeasurer {
    private cache: Utils.Cache<Dimensions>;
    constructor(area: D3.Selection, className?: string) {
      super(area, className);
      this.cache = new Utils.Cache<Dimensions>(super._measureCharacter, Utils.Methods.objEq);
    }

    public _measureCharacter(c: string) {
      return this.cache.get(c);
    }
  }
}
