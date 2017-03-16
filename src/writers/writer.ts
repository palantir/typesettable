/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IPenFactoryContext } from "../contexts";
import { AbstractMeasurer } from "../measurers";
import { Methods, StringMethods } from "../utils";
import { Wrapper } from "../wrappers";

export type IXAlign = "left" | "center" | "right";
export type IYAlign = "top" | "center" | "bottom";

/**
 * A euclidean transformation, which preserves the size of text and only affects
 * location and orientation.
 */
export interface ITransform {
  /**
   * Translation in pixels.
   */
  translate: [number, number];

  /**
   * Rotation in degrees.
   */
  rotate: number;
}

export interface IPen {
  /**
   * Called once all the lines have been written
   */
  destroy?: () => void;

  /**
   * Called once for each line of text in the block.
   *
   * `xOffset` and `yOffset` are assumed to be in an independent text-aligned
   * coordinate space.
   */
  write: (line: string, width: number, anchor: IXAlign, xOffset: number, yOffset: number) => void;
}

/**
 * A factory method that sets up a line pen for a new block of text. This method
 * will receive a transform that needs to be applied to the whole text block.
 *
 * You may optionally pass the final `container` argument to specify the parent
 * into which the text is written. This allows you to easily share cached
 * measurer results while writing text into multiple SVG elements or Canvas
 * contexts. Use this ONLY if you are certain the font styles will match those
 * used by the `Measurer`'s `IRuler`.
 *
 * The returned `IPen` will be used render each line in the block.
 */
export type IPenFactory<T> = (text: string, transform: ITransform, container?: T) => IPen;

export interface IWriteOptions {
  /**
   * An optional cardinal-direction rotation for the whole text block.
   *
   * Supported rotations are -90, 0, 180, and 90.
   *
   * @default 0
   */
  textRotation?: number;

  /**
   * An optional shear angle. Shearing allows the rotation and re-alignment of
   * individual lines as opposed to the whole text block.
   *
   * Supported shears are between -80 and 80 degrees.
   *
   * @default 0
   */
  textShear?: number;

  /**
   * The x-alignment of text.
   *
   * @default "left"
   */
  xAlign?: IXAlign;

  /**
   * The y-alignment of text.
   *
   * @default "top"
   */
  yAlign?: IYAlign;
}

const DEFAULT_WRITE_OPTIONS: IWriteOptions = {
  textRotation: 0,
  textShear: 0,
  xAlign: "left",
  yAlign: "top",
};

export class Writer {
  public static XOffsetFactor: { [K in IXAlign]: number } = {
    center: 0.5,
    left: 0,
    right: 1,
  };

  public static YOffsetFactor: { [K in IYAlign]: number } = {
    bottom: 1,
    center: 0.5,
    top: 0,
  };

  private static SupportedRotation = [-90, 0, 180, 90];

  constructor(
    private _measurer: AbstractMeasurer,
    private _penFactory: IPenFactoryContext<any>,
    private _wrapper?: Wrapper) {
  }

  public measurer(newMeasurer: AbstractMeasurer): Writer {
    this._measurer = newMeasurer;
    return this;
  }

  public wrapper(newWrapper: Wrapper): Writer {
    this._wrapper = newWrapper;
    return this;
  }

  public penFactory(newPenFactory: IPenFactoryContext<any>): Writer {
    this._penFactory = newPenFactory;
    return this;
  }

  /**
   * Writes the text into the container. If no container is specified, the pen's
   * default container will be used.
   */
  public write<T>(text: string, width: number, height: number, options: IWriteOptions = {}, container?: T) {
    // apply default options
    options = Methods.defaults({}, DEFAULT_WRITE_OPTIONS, options);

    // validate input
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
    const shearDegrees = options.textShear;
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

    // normalize and wrap text
    const normalizedText = StringMethods.combineWhitespace(text);
    const wrappedText = this._wrapper ?
      this._wrapper.wrap(
        normalizedText,
        this._measurer,
        shearCorrectedPrimaryDimension,
        shearCorrectedSecondaryDimension,
      ).wrappedText : normalizedText;
    const lines = wrappedText.split("\n");

    // correct the intial x/y offset of the text container accounting shear and alignment
    const shearCorrectedXOffset = Writer.XOffsetFactor[options.xAlign] *
      shearCorrectedPrimaryDimension * Math.sin(shearRadians);
    const shearCorrectedYOffset = Writer.YOffsetFactor[options.yAlign] *
      (shearCorrectedSecondaryDimension - lines.length * lineHeight);
    const shearCorrection = shearCorrectedXOffset - shearCorrectedYOffset;

    // compute transform
    let translate: [number, number] = [0, 0];
    const rotate = options.textRotation + shearDegrees;
    switch (options.textRotation) {
      case 90:
        translate = [width + shearCorrection, 0];
        break;
      case -90:
        translate = [-shearCorrection, height];
        break;
      case 180:
        translate = [width, height + shearCorrection];
        break;
      default:
        translate = [0, -shearCorrection];
        break;
    }

    // create a new pen and write the lines
    const linePen = this._penFactory.createPen(text, { translate, rotate }, container);
    this.writeLines(
      lines,
      linePen,
      shearCorrectedPrimaryDimension,
      lineHeight,
      shearShift,
      options.xAlign,
    );
    if (linePen.destroy != null) {
      linePen.destroy();
    }
  }

  private writeLines(
      lines: string[],
      linePen: IPen,
      width: number,
      lineHeight: number,
      shearShift: number,
      xAlign: IXAlign) {
    lines.forEach((line: string, i: number) => {
      const xShearOffset = (shearShift > 0) ? (i + 1) * shearShift : (i) * shearShift;
      linePen.write(line, width, xAlign, xShearOffset, (i + 1) * lineHeight);
    });
  }
}
