module SVGTypewriter.Utils.DOM {
  export function transform(s: d3.Selection<any>): d3.Transform;
  export function transform(s: d3.Selection<any>, x: number, y: number): d3.Selection<any>;
  export function transform(s: d3.Selection<any>, x?: number, y?: number): any {
    var xform = d3.transform(s.attr("transform"));
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

  export function getBBox(element: d3.Selection<any>): SVGRect {
    var bbox: SVGRect;
    try {
      bbox = (<any> element.node()).getBBox();
    } catch (err) {
      bbox = {
        x: 0, y: 0, width: 0, height: 0
      };
    }
    return bbox;
  }
}
