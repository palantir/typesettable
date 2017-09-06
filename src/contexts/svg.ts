/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IDimensions } from "../measurers";
import { ITransform, IXAlign, Writer } from "../writers";
import { HtmlUtils } from "./html";
import { ITypesetterContext } from "./index";

export type IAnchor = "start" | "middle" | "end";

export class SvgUtils {
  public static SVG_NS = "http://www.w3.org/2000/svg";

  /**
   * Appends an SVG element with the specified tag name to the provided element.
   * The variadic classnames are added to the new element.
   *
   * Returns the new element.
   */
  public static append(element: Element, tagName: string, ...classNames: string[]) {
    const child = SvgUtils.create(tagName, ...classNames);
    element.appendChild(child);
    return child;
  }

  /**
   * Creates and returns a new SVGElement with the attached classnames.
   */
  public static create(tagName: string, ...classNames: string[]) {
    const element = document.createElementNS(SvgUtils.SVG_NS, tagName) as SVGElement;
    HtmlUtils.addClasses(element, ...classNames);
    return element;
  }

  /**
   * Returns the width/height of svg element's bounding box
   */
  public static getDimensions(element: SVGGraphicsElement): IDimensions {
    // using feature detection, safely return the bounding box dimensions of the
    // provided svg element
    if (element.getBBox) {
      try {
        const { width, height } = element.getBBox();
        // copy to prevent NoModificationAllowedError
        return { width, height };
      } catch (err) {
        // swallow any errors that occur (Firefox Linux)
      }
    }

    // if can't get valid bbox, return 0,0
    return { height: 0, width: 0 };
  }
}

/**
 * Parameters for `IRuler` implementation.
 *
 * To measure text in SVG, first we append the `containerElement` to the
 * `parentElement`. Then, we set the text content on `textElement` and measure
 * the bounding box. Finally, we remove the `containerElement` from the parent.
 *
 * The root element of the context may be any `SVGElement` including `<text>`
 * elements, so find the best `<text>` element for measuring. We prioritize
 * exact `<text>` elements, then the first existing `<text>` element descendent,
 * then finally we will just create a new `<text>` element.
 */
interface ITemporaryTextElementHarness {
  parentElement: Element;
  containerElement: Element & SVGGraphicsElement;
  textElement: SVGTextElement;
}

/**
 * A typesetter context for SVG.
 *
 * @param element - The CSS font styles applied to `element` will determine the
 * size of text measurements. Also the default text block container.
 * @param className - added to new text blocks
 * @param addTitleElement - enable title tags to be added to new text blocks.
 */
export class SvgContext implements ITypesetterContext<SVGElement> {

  private static AnchorMap: { [K in IXAlign]: string } = {
    center: "middle",
    left: "start",
    right: "end",
  };

  public constructor(
      private element: SVGElement,
      private className?: string,
      private addTitleElement = false) {
  }

  public setAddTitleElement(addTitleElement: boolean) {
    this.addTitleElement = addTitleElement;
  }

  public createRuler = () => {
    const { parentElement, containerElement, textElement } = this.getTextElements(this.element);
    return (text: string) => {
      parentElement.appendChild(containerElement);
      textElement.textContent = text;
      const dimensions = SvgUtils.getDimensions(textElement);
      parentElement.removeChild(containerElement); // element.remove() doesn't work in IE11
      return dimensions;
    };
  }

  public createPen = (text: string, transform: ITransform, element?: Element) => {
    if (element == null) {
      element = this.element;
    }
    const textContainer = SvgUtils.append(element, "g", "text-container", this.className);

    // attach optional title
    if (this.addTitleElement) {
      SvgUtils.append(textContainer, "title").textContent = text;
      textContainer.setAttribute("title", text);
    }

    // create and transform text block group
    const textBlockGroup = SvgUtils.append(textContainer, "g", "text-area") as SVGGElement;
    textBlockGroup.setAttribute("transform",
      `translate(${transform.translate[0]},${transform.translate[1]})` +
      `rotate(${transform.rotate})`,
    );
    return this.createSvgLinePen(textBlockGroup);
  }

  private createSvgLinePen(textBlockGroup: SVGGElement) {
    return {
      write: (
          line: string,
          width: number,
          xAlign: IXAlign,
          xOffset: number,
          yOffset: number,
        ) => {
          xOffset += width * Writer.XOffsetFactor[xAlign];
          const element = SvgUtils.append(textBlockGroup, "text", "text-line");
          element.textContent = line;
          element.setAttribute("text-anchor", SvgContext.AnchorMap[xAlign]);
          element.setAttribute("transform", `translate(${xOffset},${yOffset})`);
          element.setAttribute("y", "-0.25em");
        },
    };
  }

  private getTextElements(element: Element): ITemporaryTextElementHarness {
    // if element is already a text element, return it
    if (element.tagName === "text") {
      let parentElement = element.parentElement;
      if (parentElement == null) {
        parentElement = element.parentNode as HTMLElement;
      }
      // must be removed from parent since we re-add it on every measurement
      parentElement.removeChild(element);

      return {
        containerElement: element as Element & SVGGraphicsElement,
        parentElement,
        textElement: element as SVGTextElement,
      };
    }

    // if element has a text element descendent, select it and return it
    const selected = element.querySelector("text");
    if (selected != null) {
      let parentElement = selected.parentElement;
      if (parentElement == null) {
        parentElement = selected.parentNode as HTMLElement;
      }
      // must be removed from parent since we re-add it on every measurement
      parentElement.removeChild(selected);
      return {
        containerElement: selected as Element & SVGGraphicsElement,
        parentElement,
        textElement: selected as SVGTextElement,
      };
    }

    // otherwise create a new text element
    const created = SvgUtils.create("text", this.className) as SVGTextElement;
    return {
      containerElement: created,
      parentElement: element,
      textElement: created,
    };
  }
}
