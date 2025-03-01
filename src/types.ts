import type * as xmljs from 'xml-js-v2';
import { Marshaller } from './marshallers';

/**
 * Only here for the sake of the documentation and type checking.
 * No need to "implement" this interface.
 *
 * The XML class's constructor should not require any arguments.
 * This is because the xml-class-transformer needs to be able to construct them
 * when it needs to. And if the constructor relies on the arguments then it will crash.
 *
 * Note that it is okay and even recommended to give your classes a constructor like this:
 * ```ts
 * class SomeXmlElement {
 *   ...
 *   constructor(seed?: SomeXmlElement) {
 *     Object.assign(this, seed || {})
 *   }
 * }
 * ```
 *
 * note that the `seed` argument is optional. Such a constructor
 * gives you a way to create instances with passed values and also
 * enable the library to construct them without passing any arguments.
 */
export type XmlClass = {
  new (/** here should not be any required arguments */): any;
};

/**
 * These types are considered as primitive,
 * which means that there are built-in marshallers for them,
 * and you can simply do `{ type: () => String }`.
 */
export type XmlPrimitiveType =
  | typeof String
  | typeof Number
  | typeof Boolean
  | typeof BigInt
  | typeof Date;

export type XmlType = XmlPrimitiveType | XmlClass;

export interface XmlElemOptions {
  /**
   * The xmlns attribute value. Specifies the default XML namespace.
   * This is just a shortcut for the `@XmlAttribute({ name: 'xmlns', type: () => String })` property decorator.
   *
   * @example
   * { xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/' }
   */
  xmlns?: string;

  /**
   * XML element name.
   * If not specified, the class name will be used.
   */
  name?: string;
}

export interface XmlChildElemOptions {
  /**
   * Specify primitive type or class type for parsing and serializing.
   *
   * Not compatible with the `union` and `marshaller` options.
   *
   * @example
   * { type: () => String }
   * { type: () => Number }
   * { type: () => Boolean }
   * { type: () => BigInt }
   * { type: () => Date }
   * { type: () => CustomClass }
   */
  type?: () => XmlType;

  /**
   * A custom marshaller.
   * Not compatible with the `type` and `union` options.
   *
   * @example
   * class CapitalizedBooleanMarshaller implements Marshaller<boolean> {
   *    marshal(obj: boolean): string {
   *      return obj ? 'True' : 'False';
   *    }
   *
   *    unmarshal(chardata: string | undefined): boolean {
   *      return chardata == 'True' ? true : false;
   *    }
   * }
   * \@XmlChildElem({ marshaller: new CapitalizedBooleanMarshaller() })
   * isSomethingEnabled: boolean;
   *
   * @example
   * const momentMarshaller: Marshaller<moment.Moment> = {
   *    marshal = (val: moment.Moment): string => val.toISOString(),
   *    unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
   * }
   * \@XmlChildElem({ marshaller: momentMarshaller })
   * creationDateOfSomething: moment.Moment;
   */
  marshaller?: Marshaller<unknown>;

  /**
   * You can also specify union types, then at the parsing time
   * the one whose name matches the XML element name will be selected.
   * The serialization of union types is performed in the same manner:
   * the name of the class is used as the XML element name.
   *
   * Union types are not compatible with the `type`, `marshaller` and `name` options.
   *
   * Primitive types are not supported in unions.
   *
   * @example
   * { union: () => [User, Admin] }
   */
  union?: () => XmlClass[];

  /**
   * If true, the property will be parsed and serialized as an array.
   */
  array?: boolean;

  /**
   * A custom XML element name.
   * If not specified, the property name will be used.
   * It is recommended to specify it explicitly for expressiveness.
   *
   * Not compatible with the `union` option, because union typed elements name is
   * gathered from the union's members names.
   */
  name?: string | undefined;
}

export interface XmlAttributeOptions {
  /**
   * XML attribute name.
   * If not specified, the property name will be used.
   */
  name?: string | undefined;

  /**
   * XML Attributes can only be of primitive types.
   * Specify the primitive type for parsing and serializing the attribute.
   *
   * Not compatible with the `marshaller` options.
   *
   * @example
   * { type: () => String }
   * { type: () => Number }
   * { type: () => Boolean }
   * { type: () => BigInt }
   * { type: () => Date }
   * { type: () => CustomClass }
   */
  type?: () => XmlPrimitiveType;

  /**
   * A custom marshaller.
   * Not compatible with the `type` options.
   *
   * @example
   * class CapitalizedBooleanMarshaller implements Marshaller<boolean> {
   *    marshal(obj: boolean): string {
   *      return obj ? 'True' : 'False';
   *    }
   *
   *    unmarshal(chardata: string | undefined): boolean {
   *      return chardata == 'True' ? true : false;
   *    }
   * }
   * \@XmlAttribute({ marshaller: new CapitalizedBooleanMarshaller() })
   * isSomethingEnabled: boolean;
   *
   * @example
   * const momentMarshaller: Marshaller<moment.Moment> = {
   *    marshal = (val: moment.Moment): string => val.toISOString(),
   *    unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
   * }
   * \@XmlAttribute({ marshaller: momentMarshaller })
   * creationDateOfSomething: moment.Moment;
   */
  marshaller?: Marshaller<unknown>;
}

export interface XmlChardataOptions {
  /**
   * An XML chardata an only be of primitive types.
   * Specify the primitive type for parsing and serializing the chardata.
   *
   * Not compatible with the `marshaller` options.
   *
   * @example
   * { type: () => String }
   * { type: () => Number }
   * { type: () => Boolean }
   * { type: () => BigInt }
   * { type: () => Date }
   * { type: () => CustomClass }
   */
  type?: () => XmlPrimitiveType;

  /**
   * A custom marshaller.
   * Not compatible with the `type` options.
   *
   * @example
   * class CapitalizedBooleanMarshaller implements Marshaller<boolean> {
   *    marshal(obj: boolean): string {
   *      return obj ? 'True' : 'False';
   *    }
   *
   *    unmarshal(chardata: string | undefined): boolean {
   *      return chardata == 'True' ? true : false;
   *    }
   * }
   * \@XmlChardata({ marshaller: new CapitalizedBooleanMarshaller() })
   * isSomethingEnabled: boolean;
   *
   * @example
   * const momentMarshaller: Marshaller<moment.Moment> = {
   *    marshal = (val: moment.Moment): string => val.toISOString(),
   *    unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
   * }
   * \@XmlChardata({ marshaller: momentMarshaller })
   * creationDateOfSomething: moment.Moment;
   */
  marshaller?: Marshaller<unknown>;
}

export interface ClassToXmlOptions extends xmljs.Options.JS2XML {
  /**
   * Whether to include the default declaration line `<?xml version="1.0" encoding="UTF-8"?>` or not.
   * @default true
   */
  declaration?:
    | boolean
    | {
        attributes?: xmljs.DeclarationAttributes;
      };
}
