///<reference path="reference.ts" />

module SVGTypewriter {
  export class Measurer {
    private measurerArea: D3.Selection;
    
    constructor(area: D3.Selection) {
      this.measurerArea = area;
    }
  }
}