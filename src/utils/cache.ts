import * as d3 from "d3";

export class Cache<T> {
  private cache: d3.Map<T> = d3.map<T>();
  private compute: (k: string) => T;
  private valueEq: (v: T, w: T) => boolean;

  /**
   * @constructor
   *
   * @param {string} compute The function whose results will be cached.
   * @param {(v: T, w: T) => boolean} [valueEq]
   *        Used to determine if the value of canonicalKey has changed.
   *        If omitted, defaults to === comparision.
   */
  constructor(compute: (k: string) => T,
              valueEq: (v: T, w: T) => boolean =
                        (v: T, w: T) => v === w) {
    this.compute = compute;
    this.valueEq = valueEq;
  }

  /**
   * Attempt to look up k in the cache, computing the result if it isn't
   * found.
   *
   * @param {string} k The key to look up in the cache.
   * @return {T} The value associated with k; the result of compute(k).
   */
  public get(k: string): T {
    if (!this.cache.has(k)) {
      this.cache.set(k, this.compute(k));
    }
    return this.cache.get(k);
  }

  /**
   * Reset the cache empty.
   *
   * @return {Cache<T>} The calling Cache.
   */
  public clear(): Cache<T> {
    this.cache = d3.map<T>();
    return this;
  }
}
