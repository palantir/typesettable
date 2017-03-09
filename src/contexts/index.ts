/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IRulerFactory } from "../measurers";
import { IPenFactory } from "../writers";

/**
 * An object that can create an `IPen`.
 */
export interface IPenFactoryContext<T> {
    createPen: IPenFactory<T>;
}

/**
 * An object that can create an `IRuler`.
 */
export interface IRulerFactoryContext {
    createRuler: IRulerFactory;
}

/**
 * Both SVG and Canvas contexts use common elements for both their `IRuler` and
 * `IPen` implementations, so they extend this composite interface.
 */
export interface ITypesetterContext<T> extends IPenFactoryContext<T>, IRulerFactoryContext {
}

export * from "./svg";
export * from "./canvas";
export * from "./html";
