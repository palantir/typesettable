///<reference path="reference.ts" />

namespace SVGTypewriter.Writers {
  export interface WriteOptions {
      selection: d3.Selection<any>;
      xAlign: string;
      yAlign: string;
      textRotation: number;
      animator?: Animators.BaseAnimator;
    }

  export class Writer {
    private _measurer: Measurers.AbstractMeasurer;
    private _wrapper: Wrappers.Wrapper;
    private _addTitleElement: boolean;
    private static nextID = 0;
    public _writerID = Writer.nextID++;
    public _elementID = 0;

    private static SupportedRotation = [-90, 0, 180, 90];

    private static AnchorConverter: {[s: string]: string} = {
      left: "start",
      center: "middle",
      right: "end",
    };

    private static XOffsetFactor: {[s: string]: number} = {
      left: 0,
      center: 0.5,
      right: 1,
    };

    private static YOffsetFactor: {[s: string]: number} = {
      top: 0,
      center: 0.5,
      bottom: 1,
    };

    constructor(measurer: Measurers.AbstractMeasurer,
                wrapper?: Wrappers.Wrapper) {
      this.measurer(measurer);
      if (wrapper) {
        this.wrapper(wrapper);
      }

      this.addTitleElement(false);
    }

    public measurer(newMeasurer: Measurers.AbstractMeasurer): Writer {
      this._measurer = newMeasurer;
      return this;
    }

    public wrapper(newWrapper: Wrappers.Wrapper): Writer {
      this._wrapper = newWrapper;
      return this;
    }

    public addTitleElement(add: boolean): Writer {
      this._addTitleElement = add;
      return this;
    }

    private writeLine(line: string, g: d3.Selection<any>, width: number, xAlign: string, yOffset: number) {
      var textEl = g.append("text");
      textEl.text(line);
      var xOffset = width * Writer.XOffsetFactor[xAlign];
      var anchor: string = Writer.AnchorConverter[xAlign];
      textEl.attr("text-anchor", anchor).classed("text-line", true);
      Utils.DOM.transform(textEl, xOffset, yOffset).attr("y", "-0.25em");;
    }

    private writeText(text: string, writingArea: d3.Selection<any>, width: number, height: number, xAlign: string, yAlign: string) {
      var lines = text.split("\n");
      var lineHeight = this._measurer.measure().height;
      var yOffset = Writer.YOffsetFactor[yAlign] * (height - lines.length * lineHeight);
      lines.forEach((line: string, i: number) => {
        this.writeLine(line, writingArea, width, xAlign, (i + 1) * lineHeight + yOffset);
      });
    }

    public write(text: string, width: number, height: number, options: WriteOptions) {
      if (Writer.SupportedRotation.indexOf(options.textRotation) === -1) {
        throw new Error("unsupported rotation - " + options.textRotation);
      }

      var orientHorizontally = Math.abs(Math.abs(options.textRotation) - 90) > 45;
      var primaryDimension = orientHorizontally ? width : height;
      var secondaryDimension = orientHorizontally ? height : width;

      var textContainer = options.selection.append("g").classed("text-container", true);
      if (this._addTitleElement) {
        textContainer.append("title").text(text);
      }

      var textArea = textContainer.append("g").classed("text-area", true);
      var wrappedText = this._wrapper ?
                          this._wrapper.wrap(text, this._measurer, primaryDimension, secondaryDimension).wrappedText :
                          text;

      this.writeText(wrappedText,
                     textArea,
                     primaryDimension,
                     secondaryDimension,
                     options.xAlign,
                     options.yAlign
                     );
      var xForm = d3.transform("");
      var xForm2 = d3.transform("");
      xForm.rotate = options.textRotation;

      switch (options.textRotation) {
        case 90:
          xForm.translate = [width, 0];
          xForm2.rotate = -90;
          xForm2.translate = [0, 200];
          break;
        case -90:
          xForm.translate = [0, height];
          xForm2.rotate = 90;
          xForm2.translate = [width, 0];
          break;
        case 180:
          xForm.translate = [width, height];
          xForm2.translate = [width, height];
          xForm2.rotate = 180;
          break;
      }

      textArea.attr("transform", xForm.toString());
      this.addClipPath(textContainer, xForm2);
      if (options.animator) {
        options.animator.animate(textContainer);
      }
    }

    private addClipPath(selection: d3.Selection<any>, transform: any) {
      var elementID = this._elementID++;
      var prefix = /MSIE [5-9]/.test(navigator.userAgent) ? "" : document.location.href;
      prefix = prefix.split("#")[0]; // To fix cases where an anchor tag was used
      var clipPathID = "clipPath" + this._writerID + "_" + elementID;
      selection.select(".text-area").attr("clip-path", "url(\"" + prefix + "#" + clipPathID +"\")");
      var clipPathParent = selection.append("clipPath").attr("id", clipPathID);
      var bboxAttrs = Utils.DOM.getBBox(selection.select(".text-area"));
      var box = clipPathParent.append("rect");
      box.classed("clip-rect", true).attr({
        x: bboxAttrs.x,
        y: bboxAttrs.y,
        width: bboxAttrs.width,
        height: bboxAttrs.height,
      });
    }
  }
}
