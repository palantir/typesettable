/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IDimensions } from "../measurers";
import { IAnchor, ITransform } from "../writers";
import { ITypesetterContext } from "./index";

export class HtmlUtils {
  /**
   * Appends an SVG element with the specified tag name to the provided element.
   * The variadic classnames are added to the new element.
   *
   * Returns the new element.
   */
  public static append(element: Element, tagName: string, ...classNames: string[]) {
    const child = HtmlUtils.create(tagName, ...classNames);
    element.appendChild(child);
    return child;
  }

  /**
   * Creates and returns a new SVGElement with the attached classnames.
   */
  public static create(tagName: string, ...classNames: string[]) {
    const element = document.createElement(tagName) as HTMLElement;
    HtmlUtils.addClasses(element, ...classNames);
    return element;
  }

  /**
   * Adds the variadic classnames to the element
   */
  public static addClasses(element: Element, ...classNames: string[]) {
    classNames = classNames.filter((c) => c != null);
    if (element.classList != null) {
      classNames.forEach((className) => {
        element.classList.add(className);
      });
    } else {
      // IE 11 does not support classList
      element.setAttribute("class", classNames.join(" "));
    }
  }

  /**
   * Returns the width/height of svg element's bounding box
   */
  public static getDimensions(element: HTMLElement): IDimensions {
    // using feature detection, safely return the bounding box dimensions of the
    // provided svg element
    if (element.getBoundingClientRect) {
      try {
        const { width, height } = element.getBoundingClientRect();
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
 * A typesetter context for HTML.
 *
 * @param element - The CSS font styles applied to `element` will determine the
 * size of text measurements. Also the default text block container.
 * @param className - added to new text blocks
 * @param addTitleElement - enable title tags to be added to new text blocks.
 */
export class HtmlContext implements ITypesetterContext<HTMLElement> {
  private static AnchorConverter: { [s: string]: string } = {
    middle: "center",
    start: "left",
    end: "right",
  };

  public constructor(
      private element: HTMLElement,
      private className?: string,
      private addTitle = false) {
  }

  public setAddTitle(addTitle: boolean) {
    this.addTitle = addTitle;
  }

  public createRuler = () => {
    return (text: string) => {
      const textElement = HtmlUtils.append(this.element, "span", "text-tmp", this.className);
      textElement.textContent = text;
      const dimensions = HtmlUtils.getDimensions(textElement);
      this.element.removeChild(textElement); // element.remove() doesn't work in IE11
      return dimensions;
    };
  }

  public createPen = (text: string, transform: ITransform, element?: Element) => {
    if (element == null) {
      element = this.element;
    }

    const textBlock = HtmlUtils.append(element, "div", "text-block", this.className);
    textBlock.style.position = "relative";
    textBlock.style.transform =
      `translate(0, -1em) ` +
      `translate(${transform.translate[0]}px, ${transform.translate[1]}px) ` +
      `rotate(${transform.rotate}deg)`;
    textBlock.style.transformOrigin = "0 1.2em";

    // attach optional title
    if (this.addTitle) {
      textBlock.setAttribute("title", text);
    }
    return this.createHtmlLinePen(textBlock);
  }

  private createHtmlLinePen(textBlock: HTMLElement) {
    return {
      write: (
          line: string,
          anchor: IAnchor,
          xOffset: number,
          yOffset: number,
        ) => {
          const textLine = HtmlUtils.append(textBlock, "div", "text-line");
          textLine.textContent = line;
          textLine.style.textAlign = HtmlContext.AnchorConverter[anchor];
          textLine.style.position = "absolute";
          textLine.style.whiteSpace = "nowrap";
          textLine.style.top = `${yOffset}px`;
          textLine.style.left = `${xOffset}px`;
        },
    };
  }
}
