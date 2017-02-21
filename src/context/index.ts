/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { IRulerFactory } from "../measurers";
import { IPenFactory } from "../writers";

export interface IPenFactoryContext<T> {
    createPen: IPenFactory<T>;
}

export interface IRulerFactoryContext {
    createRuler: IRulerFactory;
}

export interface ITypesetterContext<T> extends IPenFactoryContext<T>, IRulerFactoryContext {
}

export * from "./svg";
export * from "./canvas";
