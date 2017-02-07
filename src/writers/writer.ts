/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as Animators from "../animators";
import * as Measurers from "../measurers";
import * as Utils from "../utils";
import * as Wrappers from "../wrappers";

export interface IWriteOptions {
  selection: Utils.AnySelection;
  xAlign: string;
  yAlign: string;
  textRotation: number;
  animator?: Animators.BaseAnimator;
}

export class Writer {
  private static nextID = 0;
  private static SupportedRotation = [-90, 0, 180, 90];

  private static AnchorConverter: { [s: string]: string } = {
    center: "middle",
    left: "start",
    right: "end",
  };

  private static XOffsetFactor: { [s: string]: number } = {
    center: 0.5,
    left: 0,
    right: 1,
  };

  private static YOffsetFactor: { [s: string]: number } = {
    bottom: 1,
    center: 0.5,
    top: 0,
  };

  public _writerID = Writer.nextID++;
  public _elementID = 0;
  private _measurer: Measurers.AbstractMeasurer;
  private _wrapper: Wrappers.Wrapper;
  private _addTitleElement: boolean;

  constructor(
    measurer: Measurers.AbstractMeasurer,
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
      throw new Error("unsupported rotation - " + options.textRotation);
    }

    const orientHorizontally = Math.abs(Math.abs(options.textRotation) - 90) > 45;
    const primaryDimension = orientHorizontally ? width : height;
    const secondaryDimension = orientHorizontally ? height : width;

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
        primaryDimension,
        secondaryDimension,
      ).wrappedText : normalizedText;

    this.writeText(
      wrappedText,
      textArea,
      primaryDimension,
      secondaryDimension,
      options.xAlign,
      options.yAlign,
    );

    let translate = [0, 0];
    switch (options.textRotation) {
      case 90:
        translate = [width, 0];
        break;
      case -90:
        translate = [0, height];
        break;
      case 180:
        translate = [width, height];
        break;
      default:
        break;
    }

    textArea.attr("transform", `translate(${translate[0]}, ${translate[1]}) rotate(${options.textRotation})`);
    this.addClipPath(textContainer);
    if (options.animator) {
      options.animator.animate(textContainer);
    }
  }

  private writeLine(line: string, g: Utils.AnySelection, width: number, xAlign: string, yOffset: number) {
    const textEl = g.append("text");
    textEl.text(line);
    const xOffset = width * Writer.XOffsetFactor[xAlign];
    const anchor: string = Writer.AnchorConverter[xAlign];
    textEl.attr("text-anchor", anchor).classed("text-line", true);
    Utils.DOM.transform(textEl, xOffset, yOffset).attr("y", "-0.25em");
  }

  private writeText(
    text: string,
    writingArea: Utils.AnySelection,
    width: number,
    height: number,
    xAlign: string,
    yAlign: string) {

    const lines = text.split("\n");
    const lineHeight = this._measurer.measure().height;
    const yOffset = Writer.YOffsetFactor[yAlign] * (height - lines.length * lineHeight);
    lines.forEach((line: string, i: number) => {
      this.writeLine(line, writingArea, width, xAlign, (i + 1) * lineHeight + yOffset);
    });
  }

  private addClipPath(selection: Utils.AnySelection) {
    const elementID = this._elementID++;
    let prefix = /MSIE [5-9]/.test(navigator.userAgent) ? "" : document.location.href;
    prefix = prefix.split("#")[0]; // To fix cases where an anchor tag was used
    const clipPathID = "clipPath" + this._writerID + "_" + elementID;
    selection.select(".text-area").attr("clip-path", "url(\"" + prefix + "#" + clipPathID + "\")");
    const clipPathParent = selection.append("clipPath").attr("id", clipPathID);
    const bboxAttrs = Utils.DOM.getBBox(selection.select(".text-area"));
    const box = clipPathParent.append("rect");
    Utils.DOM.applyAttrs(box.classed("clip-rect", true), {
      height: bboxAttrs.height,
      width: bboxAttrs.width,
      x: bboxAttrs.x,
      y: bboxAttrs.y,
    });
  }
}
