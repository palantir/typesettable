///<reference path="reference.ts" />

module SVGTypewriter.Writers {
  export interface WriteOptions {
      selection: D3.Selection;
      xAlign: string;
      yAlign: string;
      textOrientation: string;
    }

  export class Writer {
    private _measurer: Measurers.AbstractMeasurer;
    private _wrapper: Wrappers.Wrapper;

    private static AnchorConverter: {[s: string]: string} = {
      left: "start",
      center: "middle",
      right: "end"
    };

    private static OrientationXOffsetFactor: {[s: string]: number} = {
      right: 1,
      left: 0,
      horizontal: 0
    };

    private static OrientationYOffsetFactor: {[s: string]: number} = {
      right: 0,
      left: 1,
      horizontal: 0
    };

    private static XOffsetFactor: {[s: string]: number} = {
      left: 0,
      center: 0.5,
      right: 1
    };

    private static YOffsetFactor: {[s: string]: number} = {
      top: 0,
      center: 0.5,
      bottom: 1
    };

    private static RightTranslator: {[s: string]: string} = {
      left: "bottom",
      right: "top",
      center: "center",
      top: "left",
      bottom: "right"
    };

    private static LeftTranslator : {[s: string]: string} = {
      left: "top",
      right: "bottom",
      center: "center",
      top: "right",
      bottom: "left"
    };

    private static HorizontalTranslator : {[s: string]: string} = {
      left: "left",
      right: "right",
      center: "center",
      top: "top",
      bottom: "bottom"
    };

    constructor(measurer: Measurers.AbstractMeasurer,
                wrapper: Wrappers.Wrapper) {
      this.measurer(measurer);
      this.wrapper(wrapper);
    }

    public measurer(newMeasurer: Measurers.AbstractMeasurer): Writer {
      this._measurer = newMeasurer;
      return this;
    }

    public wrapper(newWrapper: Wrappers.Wrapper): Writer {
      this._wrapper = newWrapper;
      return this;
    }

    private writeLine(line: string, g: D3.Selection, width: number, xAlign: string, yOffset: number) {
      var textEl = g.append("text");
      textEl.text(line);
      var xOffset = width * Writer.XOffsetFactor[xAlign];
      var anchor: string = Writer.AnchorConverter[xAlign];
      textEl.attr("text-anchor", anchor).classed("text-line", true);
      Utils.DOM.transform(textEl, xOffset, yOffset);
    }

    private writeText(text: string, writingArea: D3.Selection, width: number, height: number, xAlign: string, yAlign: string) {
      var lines = text.split("\n");
      var lineHeight = this._measurer.measure().height;
      var yOffset = Writer.YOffsetFactor[yAlign] * (height - lines.length * lineHeight);
      lines.forEach((line: string, i: number) => {
        this.writeLine(line, writingArea, width, xAlign, (i + 1) * lineHeight + yOffset);
      });
    }

    public write(text: string, width: number, height: number, options: WriteOptions) {
      var orientHorizontally = options.textOrientation === "horizontal";
      var primaryDimension = orientHorizontally ? width : height;
      var secondaryDimension = orientHorizontally ? height : width;
      var alignTranslator: {[s: string]: string};
      var rotate: number;
      switch (options.textOrientation) {
        case "horizontal":
          alignTranslator = Writer.HorizontalTranslator;
          rotate = 0;
          break;
        case "left":
          alignTranslator = Writer.LeftTranslator;
          rotate = -90;
          break;
        case "right":
          alignTranslator = Writer.RightTranslator;
          rotate = 90;
          break;
      }
      var textArea = options.selection.append("g").classed("textArea", true);
      var wrappedText = this._wrapper.wrap(text, this._measurer, primaryDimension, secondaryDimension).wrappedText;
      this.writeText(wrappedText,
                     textArea,
                     primaryDimension,
                     secondaryDimension,
                     alignTranslator[options.xAlign],
                     alignTranslator[options.yAlign]
                     );
      var xForm = d3.transform("");
      xForm.rotate = rotate;
      xForm.translate = [Writer.OrientationXOffsetFactor[options.textOrientation] * width,
                         Writer.OrientationYOffsetFactor[options.textOrientation] * height];
      textArea.attr("transform", xForm.toString());
      textArea.classed("rotated-" + rotate, true);
    }
  }
}
