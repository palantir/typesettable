import * as d3 from "d3";

export class DOM {
  public static transform(s: d3.Selection<any>): d3.Transform;
  public static transform(s: d3.Selection<any>, x: number, y: number): d3.Selection<any>;
  public static transform(s: d3.Selection<any>, x?: number, y?: number): any {
    const xform = d3.transform(s.attr("transform"));
    if (x == null) {
      return xform.translate;
    } else {
      y = (y == null) ? 0 : y;
      xform.translate[0] = x;
      xform.translate[1] = y;
      s.attr("transform", xform.toString());
      return s;
    }
  }

  public static getBBox(element: d3.Selection<any>): SVGRect {
    let bbox: SVGRect;
    try {
      bbox = (element.node() as any).getBBox();
    } catch (err) {
      bbox = {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      };
    }
    return bbox;
  }
}
