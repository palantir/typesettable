/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as d3 from "d3";

import * as Animators from "../animators";
import * as Measurers from "../measurers";
import * as Utils from "../utils";
import * as Wrappers from "../wrappers";

export interface IWriteOptions {
  selection: d3.Selection<any>;
  xAlign: string;
  yAlign: string;
  textRotation: number;
  textShear?: number;
  animator?: Animators.BaseAnimator;
}

export class Writer {
  private static nextID = 0;
  private static SupportedRotation = [-90, 0, 180, 90];

  private static AnchorConverter: {[s: string]: string} = {
    center: "middle",
    left: "start",
    right: "end",
  };

  private static XOffsetFactor: {[s: string]: number} = {
    center: 0.5,
    left: 0,
    right: 1,
  };

  private static YOffsetFactor: {[s: string]: number} = {
    bottom: 1,
    center: 0.5,
    top: 0,
  };

  public _writerID = Writer.nextID++;
  public _elementID = 0;
  private _measurer: Measurers.AbstractMeasurer;
  private _wrapper: Wrappers.Wrapper;
  private _addTitleElement: boolean;

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

  public write(text: string, width: number, height: number, options: IWriteOptions) {
    if (Writer.SupportedRotation.indexOf(options.textRotation) === -1) {
      throw new Error("unsupported rotation - " + options.textRotation +
        ". Supported rotations are " + Writer.SupportedRotation.join(", "));
    }
    if (options.textShear != null && options.textShear < -80 || options.textShear > 80) {
      throw new Error("unsupported shear angle - " + options.textShear + ". Must be between -80 and 80");
    }

    const orientHorizontally = Math.abs(Math.abs(options.textRotation) - 90) > 45;
    const primaryDimension = orientHorizontally ? width : height;
    const secondaryDimension = orientHorizontally ? height : width;

    // compute shear parameters
    const shearDegrees = (options.textShear || 0);
    const shearRadians = shearDegrees * Math.PI / 180;
    const lineHeight = this._measurer.measure().height;
    const shearShift = lineHeight * Math.tan(shearRadians);

    // When we apply text shear, the primary axis grows and the secondary axis
    // shrinks, due to trigonometry. The text shear feature uses the normal
    // wrapping logic with a subsituted bounding box of the corrected size
    // (computed below). When rendering the wrapped lines, we rotate the text
    // container by the text rotation angle AND the shear angle then carefully
    // offset each one so that they are still aligned to the primary alignment
    // option.
    const shearCorrectedPrimaryDimension = primaryDimension / Math.cos(shearRadians) - Math.abs(shearShift);
    const shearCorrectedSecondaryDimension = secondaryDimension * Math.cos(shearRadians);

    const textContainer = options.selection.append("g").classed("text-container", true);
    if (this._addTitleElement) {
      textContainer.append("title").text(text);
    }

    const normalizedText = Utils.StringMethods.combineWhitespace(text);

    const textArea = textContainer.append("g").classed("text-area", true);
    const wrappedText = this._wrapper ?
                        this._wrapper.wrap(
                          normalizedText,
                          this._measurer,
                          shearCorrectedPrimaryDimension,
                          shearCorrectedSecondaryDimension,
                        ).wrappedText : normalizedText;

    this.writeText(
      wrappedText,
      textArea,
      shearCorrectedPrimaryDimension,
      shearCorrectedSecondaryDimension,
      shearShift,
      options.xAlign,
      options.yAlign,
    );

    // apply text rotation and shear angles
    const xForm = d3.transform("");
    xForm.rotate = options.textRotation + shearDegrees;

    // correct the intial X offset of the text container accounting for shear
    // angle and alignment option.
    const shearCorrectedOffset = Writer.XOffsetFactor[options.xAlign] *
      shearCorrectedPrimaryDimension * Math.sin(shearRadians);

    switch (options.textRotation) {
      case 90:
        xForm.translate = [width + shearCorrectedOffset, 0];
        break;
      case -90:
        xForm.translate = [-shearCorrectedOffset, height];
        break;
      case 180:
        xForm.translate = [width, height + shearCorrectedOffset];
        break;
      default:
        xForm.translate = [0, -shearCorrectedOffset];
        break;
    }

    textArea.attr("transform", xForm.toString());

    // TODO This has never taken into account the transform at all, so it's
    // certainly in the wrong place. Why do we need it?
    this.addClipPath(textContainer);
    if (options.animator) {
      options.animator.animate(textContainer);
    }
  }

  private writeLine(
      line: string, g: d3.Selection<any>, width: number,
      xAlign: string, xOffset: number, yOffset: number) {
    const textEl = g.append("text");
    textEl.text(line);
    xOffset += width * Writer.XOffsetFactor[xAlign];
    const anchor: string = Writer.AnchorConverter[xAlign];
    textEl.attr("text-anchor", anchor).classed("text-line", true);
    Utils.DOM.transform(textEl, xOffset, yOffset).attr("y", "-0.25em");
  }

  private writeText(
      text: string,
      writingArea: d3.Selection<any>,
      width: number,
      height: number,
      shearShift: number,
      xAlign: string,
      yAlign: string) {
    const lines = text.split("\n");
    const lineHeight = this._measurer.measure().height;
    const yOffset = Writer.YOffsetFactor[yAlign] * (height - lines.length * lineHeight);
    lines.forEach((line: string, i: number) => {
      const xOffset = (shearShift > 0) ? (i + 1) * shearShift : (i) * shearShift;
      this.writeLine(line, writingArea, width, xAlign, xOffset, (i + 1) * lineHeight + yOffset);
    });
  }

  private addClipPath(selection: d3.Selection<any>) {
    const elementID = this._elementID++;
    let prefix = /MSIE [5-9]/.test(navigator.userAgent) ? "" : document.location.href;
    prefix = prefix.split("#")[0]; // To fix cases where an anchor tag was used
    const clipPathID = "clipPath" + this._writerID + "_" + elementID;
    selection.select(".text-area").attr("clip-path", "url(\"" + prefix + "#" + clipPathID + "\")");
    const clipPathParent = selection.append("clipPath").attr("id", clipPathID);
    const bboxAttrs = Utils.DOM.getBBox(selection.select(".text-area"));
    const box = clipPathParent.append("rect");
    box.classed("clip-rect", true).attr({
      height: bboxAttrs.height,
      width: bboxAttrs.width,
      x: bboxAttrs.x,
      y: bboxAttrs.y,
    });
  }
}
