import { CustomTransformer } from './transformers';
import { XmlClass, XmlType } from './types';
/**
 * Used to accumulate the metadatas from all of the property decorators:
 * `XmlChildElem`, `XmlAttribute`, `XmlChardata`, `XmlComments`
 */
export interface InternalXmlPropertyOptions {
    type?: () => XmlType;
    transformer?: CustomTransformer<unknown>;
    union?: () => XmlClass[];
    array?: boolean;
    name?: string | undefined;
    attr?: boolean;
    chardata?: boolean;
    comments?: boolean;
}
//# sourceMappingURL=internal-types.d.ts.map