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

    private writeLine(line: string, g: D3.Selection, width: number, height: number, xAlign = "left", yAlign = "top") {
      var innerG = g.append("g");
      var textEl = innerG.append("text");
      textEl.text(line);
      var xOff = width * Writer.XOffsetFactor[xAlign];
      var yOff = height * Writer.YOffsetFactor[yAlign];
      var ems = 0.85 - Writer.YOffsetFactor[yAlign];
      var anchor: string = Writer.AnchorConverter[xAlign];
      textEl.attr("text-anchor", anchor).attr("y", ems + "em");
      Utils.DOM.transform(innerG, xOff, yOff);
    }

    private writeText(text: string, writingArea: D3.Selection, width: number, height: number, options: WriteOptions) {
      var lines = text.split("\n");
      var lineHeight = this._measurer.measure().height;
      var alignTranslator: {[s: string]: string};
      var rotate: number;
      var translate: number[];
      switch (options.textOrientation) {
        case "horizontal":
          alignTranslator = Writer.HorizontalTranslator;
          translate = [0, 0];
          rotate = 0;
          break;
        case "left":
          alignTranslator = Writer.LeftTranslator;
          translate = [0, height];
          rotate = -90;
          break;
        case "right":
          alignTranslator = Writer.RightTranslator;
          translate = [width, 0];
          rotate = 90;
          break;
      }

      lines.forEach((line: string, i: number) => {
        var selection = writingArea.append("g");
        Utils.DOM.transform(selection, 0, (i + 1) * lineHeight);
        this.writeLine(line, selection, width, height, alignTranslator[options.xAlign], alignTranslator[options.yAlign]);
      });

      var xForm = d3.transform("");
      xForm.rotate = rotate;
      xForm.translate = translate;
      writingArea.attr("transform", xForm.toString());
      writingArea.classed("rotated-" + rotate, true);
    }

    public write(text: string, width: number, height: number, options: WriteOptions) {
      var orientHorizontally = options.textOrientation === "horizontal";
      var primaryDimension = orientHorizontally ? width : height;
      var secondaryDimension = orientHorizontally ? height : width;
      var wrappedText = this._wrapper.wrap(text, this._measurer, primaryDimension, secondaryDimension).wrappedText;
      var writingArea = options.selection.append("g").classed("writeText-inner-g", true);
      this.writeText(wrappedText, writingArea, width, height, options);
    }
  }
}
