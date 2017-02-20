
import { ITypesetterContext } from "./index";
import { IDimensions } from "../measurers";
import { IAnchor, ITransform } from "../writers";

export class SvgUtils {
  public static SVG_NS = "http://www.w3.org/2000/svg";

  public static append(element: Element, tagName: string, ...classNames: string[]) {
    const child = SvgUtils.create(tagName, ...classNames);
    element.appendChild(child);
    return child;
  }

  public static create(tagName: string, ...classNames: string[]) {
    const element = document.createElementNS(SvgUtils.SVG_NS, tagName);
    classNames.forEach((className) => {
      element.classList.add(className);
    });
    return element;
  }

  public static getDimensions(element: SVGLocatable): IDimensions {
    // using feature detection, safely return the bounding box dimensions of the
    // provided svg element
    if (element.getBBox) {
      return element.getBBox();
    } else {
      return { height: 0, width: 0 };
    }
  }
}

interface ITemporaryTextElementHarness {
  parent: Node;
  element: SVGTextElement;
}

/**
 * A typesetter context for SVG.
 *
 * This class can be constructed with an optional class name and a boolean to
 * enable title tags to be added to new text blocks.
 */
export class SvgContext implements ITypesetterContext {

  public constructor(
      private element: Element,
      private className?: string,
      private addTitleElement = false) {
  }

  public createRuler = () => {
    const { parent, element } = this.getTextElement(this.element);
    return (text: string) => {
      parent.appendChild(element);
      element.textContent = text;
      const dimensions = SvgUtils.getDimensions(element);
      element.remove();
      return dimensions;
    };
  }

  private getTextElement(element: Element): ITemporaryTextElementHarness {
    // if element is already a text element, return it
    if (element.tagName === "text") {
      const parent = element.parentNode;
      element.remove(); // TODO Not sure if necessary or even a good idea
      return { parent, element: element as SVGTextElement };
    }

    // if element has a text element descendent, select it and return it
    const selected = element.querySelector("text");
    if (selected != null) {
      const parent = selected.parentNode;
      selected.remove(); // TODO Not sure if necessary or even a good idea
      return { parent, element: selected };
    }

    // otherwise create a new text element
    const created = SvgUtils.create("text", this.className) as SVGTextElement;
    return { parent: element, element: created };
  }

  public createPen = (text: string, transform: ITransform) => {
    const textContainer = SvgUtils.append(this.element, "g", "text-container", this.className);

    // attach optional title
    if (this.addTitleElement) {
      SvgUtils.append(textContainer, "title").textContent = text;
      textContainer.setAttribute("title", text);
    }

    // create and transform text block group
    const textBlockGroup = SvgUtils.append(textContainer, "g", "text-area") as SVGGElement;
    textBlockGroup.setAttribute("transform", `
      translate(${transform.translate[0]}, ${transform.translate[1]})
      rotate(${transform.rotate})
    `);
    return this.createSvgLinePen(textBlockGroup);
  }

  private createSvgLinePen(textBlockGroup: SVGGElement) {
    return (
        line: string,
        anchor: IAnchor,
        xOffset: number,
        yOffset: number
      ) => {
        const element = SvgUtils.append(textBlockGroup, "text", "text-line");
        element.textContent = line;
        element.setAttribute("text-anchor", anchor);
        element.setAttribute("transform", `translate(${xOffset}, ${yOffset})`);
        element.setAttribute("y", "-0.25em");
      };
  }
}
