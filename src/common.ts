import { XmlPrimitiveType, XmlType } from './types';

export function errUnknownClass(classConstructor: any): Error {
  return new Error(
    `xml-class-transformer: class "${classConstructor}" not found. Make sure there is a @XmlElem({...}) ` +
      `decorator on it, or XmlChildElem, XmlAttribute, XmlChardata or XmlComments decorator on its properties.`,
  );
}

export function serializeUnionForLog(union: any[]): string {
  return '[' + union.map((t) => t?.name ?? `${union}`).join(', ') + ']';
}

export function isPrimitiveType(type: XmlType): type is XmlPrimitiveType {
  return (
    type === String || type === Number || type === BigInt || type === Boolean
  );
}
