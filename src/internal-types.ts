import { isPrimitiveType } from './common';
import { Marshaller } from './marshallers';
import { XmlClass, XmlType } from './types';

abstract class Fields {
  type?: () => XmlType;
  marshaller?: Marshaller<unknown>;
  union?: () => XmlClass[];
  array?: boolean;
  name?: string | undefined;
  attr?: boolean;
  chardata?: boolean;
  comments?: boolean;
}

/**
 * Used to accumulate the metadatas from all of the property decorators:
 * `XmlChildElem`, `XmlAttribute`, `XmlChardata`, `XmlComments`
 */
export class InternalXmlPropertyOptions extends Fields {
  constructor(init: Fields) {
    super();
    Object.assign(this, init);
  }

  public isPrimitiveType(): boolean {
    return this.type ? isPrimitiveType(this.type()) : false;
  }
}
