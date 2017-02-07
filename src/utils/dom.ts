/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import * as d3 from "d3";

export type AnySelection = d3.Selection<any, any, any, any>;

export class DOM {
  public static transform(s: AnySelection): string;
  public static transform(s: AnySelection, x: number, y: number): AnySelection;
  public static transform(s: AnySelection, x?: number, y?: number): any {
    if (x == null) {
      return s.attr("transform");
    } else {
      y = (y == null) ? 0 : y;
      const translate = `translate(${x}, ${y})`;
      s.attr("transform", translate);
      return s;
    }
  }

  public static getBBox(element: AnySelection): SVGRect {
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

  public static applyAttrs(element: any, attrs: any) {
    Object.keys(attrs).forEach((key) => element.attr(key, attrs[key]));
  }
}
