import { Marshaller } from './marshallers';
import { XmlClass, XmlType } from './types';
declare abstract class Fields {
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
export declare class InternalXmlPropertyOptions extends Fields {
    constructor(init: Fields);
    isPrimitiveType(): boolean;
}
export {};
