import {
  Marshaller,
  defaultBigIntMarshaller,
  defaultBooleanMarshaller,
  defaultDateMarshaller,
  defaultNumberMarshaller,
  defaultStringMarshaller,
} from './marshallers';
import { XmlClass, XmlPrimitiveType, XmlType } from './types';

export function errUnknownClass(classConstructor: any): Error {
  return new Error(
    `xml-class-transformer: class "${classConstructor}" not found. Make sure there is a @XmlElem({...}) ` +
      `decorator on it, or XmlChildElem, XmlAttribute, XmlChardata or XmlComments decorator on its properties.`,
  );
}

export function errNoXmlNameForClass(xmlClass: XmlClass): Error {
  return new Error(
    `xml-class-transformer: no XML name is specified for ${xmlClass?.name}. ` +
      `Specify it with the @XmlElem({ name: '...' }) decorator.`,
  );
}

export function serializeUnionForLog(union: any[]): string {
  return '[' + union.map((t) => t?.name ?? `${union}`).join(', ') + ']';
}

export function isPrimitiveType(type: XmlType): type is XmlPrimitiveType {
  return (
    type === String ||
    type === Number ||
    type === BigInt ||
    type === Boolean ||
    type === Date
  );
}

export function getDefaultMarshaller(type: XmlPrimitiveType): Marshaller<any> {
  switch (type) {
    case String:
      return defaultStringMarshaller;
    case Number:
      return defaultNumberMarshaller;
    case BigInt:
      return defaultBigIntMarshaller;
    case Boolean:
      return defaultBooleanMarshaller;
    case Date:
      return defaultDateMarshaller;
  }

  throw new Error('unknown primitive type ' + type);
}
