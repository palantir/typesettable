///<reference path="reference.ts" />

module SVGTypewriter.Writers {
  export class Writer {
    private _textOrientation: string;
    private _measurer: Measurers.AbstractMeasurer;

    constructor(measurer: Measurers.AbstractMeasurer,
                textOrientation: string = "horizontal") {
      this._measurer = measurer;
      this.textOrientation(textOrientation);
    }

    public textOrientation(): string;
    public textOrientation(orientation: string): Writer;
    public textOrientation(orientation?: any): any {
      if(orientation == null) {
        return this._textOrientation;
      } else {
        orientation = orientation.toLowerCase();
        if (orientation !== "horizontal" && orientation !== "vertical" ) {
          throw new Error("unsupported text orientation:" + orientation);
        }
        this._textOrientation = orientation;
        return this;
      }
    }

    public measurer(): Measurers.AbstractMeasurer;
    public measurer(newMeasurer: Measurers.AbstractMeasurer): Writer;
    public measurer(newMeasurer?: any): any {
      if(newMeasurer == null) {
        return this._measurer;
      } else {
        this._measurer = newMeasurer;
        return this;
      }
    }
  }
}
