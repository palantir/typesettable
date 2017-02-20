
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
