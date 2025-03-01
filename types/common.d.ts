import { Marshaller } from './marshallers';
import { XmlClass, XmlPrimitiveType, XmlType } from './types';
export declare function errUnknownClass(classConstructor: any): Error;
export declare function errNoXmlNameForClass(xmlClass: XmlClass): Error;
export declare function serializeUnionForLog(union: any[]): string;
export declare function isPrimitiveType(type: XmlType): type is XmlPrimitiveType;
export declare function getDefaultMarshaller(type: XmlPrimitiveType): Marshaller<any>;
