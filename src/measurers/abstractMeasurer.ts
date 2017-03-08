/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/typesettable/blob/develop/LICENSE
 */

import { IRulerFactoryContext } from "../contexts";

/**
 * Width and height of a span of text.
 */
export interface IDimensions {
  width: number;
  height: number;
};

/**
 * A method that returns the screen-space dimensions of a string of text. The
 * text is assumed to be a single span without line breaks.
 */
export type IRuler = (text: string) => IDimensions;
export type IRulerFactory = () => IRuler;

export class AbstractMeasurer {
  /**
   * A string representing the full ascender/descender range of your text.
   *
   * Note that this is really only applicable to western alphabets. If you are
   * using a different locale language such as arabic or chinese, you may want
   * to override this.
   */
  public static HEIGHT_TEXT = "bdpql";

  private ruler: IRuler;

  constructor(ruler: IRuler | IRulerFactoryContext) {
    if ((ruler as IRulerFactoryContext).createRuler != null) {
      this.ruler = (ruler as IRulerFactoryContext).createRuler();
    } else {
      this.ruler = ruler as IRuler;
    }
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
    return this.ruler(text);
  }
}
