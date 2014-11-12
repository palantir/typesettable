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

    private static XOffsetFactor: {[s: string]: number} = {
      right: 1,
      left: 0,
      horizontal: 0
    };

    private static YOffsetFactor: {[s: string]: number} = {
      right: 0,
      left: 1,
      horizontal: 0
    };

    private static XOffsetFactor2: {[s: string]: number} = {
      left: 0,
      center: 0.5,
      right: 1
    };

    private static YOffsetFactor2: {[s: string]: number} = {
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

    private writeLine(line: string, g: D3.Selection, width: number, xAlign = "left") {
      var innerG = g.append("g");
      var textEl = innerG.append("text");
      textEl.text(line);
      var xOff = width * Writer.XOffsetFactor2[xAlign];
      var anchor: string = Writer.AnchorConverter[xAlign];
      textEl.attr("text-anchor", anchor);
      Utils.DOM.transform(textEl, xOff, 0);
    }

    private insertText(text: string, writingArea: D3.Selection, width: number, xAlign: string) {
      var lines = text.split("\n");
      var lineHeight = this._measurer.measure().height;
      lines.forEach((line: string, i: number) => {
        var selection = writingArea.append("g");
        Utils.DOM.transform(selection, 0, (i + 1) * lineHeight);
        this.writeLine(line, selection, width, xAlign);
      });
    }

    private writeText(text: string, area: D3.Selection, width: number, height: number, xAlign: string, yAlign: string) {
      var writingArea = area.append("g").classed("writeText-inner-g", true);
      var textHeight = this._measurer.measure(text).height;
      this.insertText(text, writingArea, width, xAlign);
      var xForm = d3.transform("");
      xForm.translate = [0, Writer.YOffsetFactor2[yAlign] * (height - textHeight)];
      writingArea.attr("transform", xForm.toString());
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
      var textArea = options.selection.append("g").classed("writeText-inner-g", true);
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
      xForm.translate = [Writer.XOffsetFactor[options.textOrientation] * width, Writer.YOffsetFactor[options.textOrientation] * height];
      textArea.attr("transform", xForm.toString());
      textArea.classed("rotated-" + rotate, true);
    }
  }
}
