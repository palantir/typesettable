/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as d3 from "d3";

export type d3Selection<D> = d3.Selection<any, D, any, any>;

export class DOM {
  public static transform(s: d3Selection<any>): string;
  public static transform(s: d3Selection<any>, x: number, y: number): d3Selection<any>;
  public static transform(s: d3Selection<any>, x?: number, y?: number): any {
    if (x == null) {
      return s.attr("transform");
    } else {
      y = (y == null) ? 0 : y;
      const translate = `translate(${x}, ${y})`;
      s.attr("transform", translate);
      return s;
    }
  }

  public static getBBox(element: d3Selection<any>): SVGRect {
    let bbox: SVGRect;
    try {
      bbox = element.node().getBBox();
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

  public static applyAttrs(element: any, attrs: { [key: string]: any }) {
    Object.keys(attrs).forEach((key) => element.attr(key, attrs[key]));
  }
}
