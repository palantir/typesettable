///<reference path="reference.ts" />

module SVGTypewriter {
  export interface Wrapper {
    (s: string, width: number, m: Measurers.AbstractMeasurer): string[];
  }
}
