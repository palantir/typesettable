
import { ITypesetterContext } from "./index";
import { IAnchor, ITransform } from "../writers";

/**
 * Options for styling text
 */
export interface ICanvasFontStyle {
    /**
     * An optional fill color.
     *
     * If `null` the text will not be filled. But, if `undefined` we will
     * default to `#444` filled text.
     */
    fill?: string;

    /**
     * An optional CSS font string.
     *
     * If `null` or `undefined`, we will not set the font before writing text,
     * but there may already be a font style defined on the canvas rendering
     * context.
     */
    font?: string;

    /**
     * An optional stroke color.
     *
     * If `null` or `undefined` the text will not be stroked.
     */
    stroke?: string;
}

/**
 * A typesetter context for HTML5 Canvas.
 *
 * Due to the Canvas API, you must explicitly define the line height, and any
 * styling for the font must also be explicitly defined in the optional
 * `ICanvasFontStyle` object.
 */
export class CanvasContext implements ITypesetterContext {

  public constructor(
      private ctx: CanvasRenderingContext2D,
      private lineHeight = 10,
      private style: ICanvasFontStyle = {},
    ) {
        if (this.style.fill === undefined) {
            this.style.fill = "#444";
        }
  }

  public createRuler = () => {
    return (text: string) => {
        this.ctx.font = this.style.font;
        const { width } = this.ctx.measureText(text);
        return { width, height: this.lineHeight };
    };
  }

  public createPen = (_text: string, transform: ITransform) => {
    this.ctx.save();
    this.ctx.translate(transform.translate[0], transform.translate[1]);
    this.ctx.rotate(transform.rotate * Math.PI / 180.0);
    return this.createCanvasPen();
  }

  public destroyPen = () => {
    this.ctx.restore();
  }

  private createCanvasPen() {
    return (
        line: string,
        anchor: IAnchor,
        xOffset: number,
        yOffset: number
      ) => {
        this.ctx.textAlign = anchor;
        if (this.style.font != null) {
            this.ctx.font = this.style.font;
        }
        if (this.style.fill != null) {
            this.ctx.fillStyle = this.style.fill;
            this.ctx.fillText(line, xOffset, yOffset);
        }
        if (this.style.stroke != null) {
            this.ctx.strokeStyle = this.style.fill;
            this.ctx.strokeText(line, xOffset, yOffset);
        }
      };
  }
}
