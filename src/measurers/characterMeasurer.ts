///<reference path="../reference.ts" />

module SVGTypewriter.Measurers {
  export class CharacterMeasurer extends Measurer {
    public _measureCharacter(c: string) {
      return super.measure(c);
    }

    public _measureLine(line: string) {
      var charactersDimensions = line.split("").map(c => this._measureCharacter(c));
      return {
        width: d3.sum(charactersDimensions, dim => dim.width),
        height: d3.max(charactersDimensions, dim => dim.height)
      };
    }
  }
}
