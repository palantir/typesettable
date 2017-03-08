/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

export class Cache<T> {
  private cache: {[key: string]: T} = {};
  private compute: (k: string) => T;

  /**
   * @constructor
   *
   * @param {string} compute The function whose results will be cached.
   */
  constructor(compute: (k: string) => T) {
    this.compute = compute;
  }

  /**
   * Attempt to look up k in the cache, computing the result if it isn't
   * found.
   *
   * @param {string} k The key to look up in the cache.
   * @return {T} The value associated with k; the result of compute(k).
   */
  public get(k: string): T {
    if (!this.cache.hasOwnProperty(k)) {
      this.cache[k] = this.compute(k);
    }
    return this.cache[k];
  }

  /**
   * Reset the cache empty.
   *
   * @return {Cache<T>} The calling Cache.
   */
  public clear(): Cache<T> {
    this.cache = {};
    return this;
  }
}
