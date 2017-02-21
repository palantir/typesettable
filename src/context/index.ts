/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { IRuler, IRulerFactory } from "../measurers";
import { IPen, IPenFactory } from "../writers";

export interface IPenFactoryContext {
    createPen: IPenFactory;
    destroyPen?: (pen: IPen) => void;
}

export interface IRulerFactoryContext {
    createRuler: IRulerFactory;
    destroyRuler?: (ruler: IRuler) => void;
}

export interface ITypesetterContext extends IPenFactoryContext, IRulerFactoryContext {
}

export * from "./svg";
export * from "./canvas";
