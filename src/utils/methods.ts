///<reference path="../reference.ts" />

module SVGTypewriter.Utils.Methods {

  /**
   * Check if two arrays are equal by strict equality.
   */
  export function arrayEq<T>(a: T[], b: T[]): boolean {
    // Technically, null and undefined are arrays too
    if (a == null || b == null) {
      return a === b;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {any} a Object to check against b for equality.
   * @param {any} b Object to check against a for equality.
   *
   * @returns {boolean} whether or not two objects share the same keys, and
   *          values associated with those keys. Values will be compared
   *          with ===.
   */
  export function objEq(a: any, b: any): boolean {
    if (a == null || b == null) {
      return a === b;
    }
    var keysA = Object.keys(a).sort();
    var keysB = Object.keys(b).sort();
    var valuesA = keysA.map((k) => a[k]);
    var valuesB = keysB.map((k) => b[k]);
    return arrayEq(keysA, keysB) && arrayEq(valuesA, valuesB);
  }

  export function isNotEmptyString(str: string) {
    return str && str.trim() !== "";
  }
}
