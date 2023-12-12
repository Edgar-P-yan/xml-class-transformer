import type * as xmljs from 'xml-js';

/**
 * The XML class's constructor should not require any arguments.
 * This is because the xml-class-transformer needs to be able to construct them
 * when it needs to. And if the constructor relies on the arguments then it will crash.
 *
 * Note that it is okay and even recommended to give your classes a constructor like this:
 * ```ts
 * class SomeXmlElement {
 *  ...
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

export type XmlPrimitiveType = typeof String | typeof Number | typeof Boolean;
export type XmlType = XmlPrimitiveType | XmlClass;

export interface XmlEntityOptions {
  /**
   * xmlns attribute value.
   * This is just a shortcut for the `@XmlAttribute({ name: 'xmlns', type: () => String })` property decorator.
   */
  xmlns?: string;

  /**
   * XML element name.
   * If not specified, the class name will be used.
   */
  name?: string;
}

export interface XmlPropertyOptions {
  /**
   * Specify primitive type or class type for parsing and serializing.
   * @example
   * { type: () => String }
   * { type: () => Number }
   * { type: () => Boolean }
   * { type: () => CustomClass }
   *
   * Not compatible with the `union` option.
   */
  type?: () => XmlType;

  /**
   * You can also specify union types, then at the parsing time
   * the one whose name matches the XML element name will be selected.
   * The serialization of union types is performed in the same manner:
   * the name of the class is used as the XML element name.
   *
   * Union types are not compatible with the `type`, `name` and `attr` options.
   * It is not compatible with the `attr` option because bacause for now attribute values should
   * only be primitive values, and parsing strings to unions can't be definitive.
   *
   * @todo test unions of primitive with class types
   * @todo test unions of primitive types
   *
   * @example
   * { union: () => [User, Admin] }
   */
  union?: () => XmlClass[];

  /**
   * If true, the property will be parsed and serialized as an array.
   * Not compatible with the `attr` and `chardata` options.
   */
  array?: boolean;

  /**
   * XML element name.
   * If not specified, the property name will be used.
   * It is recommended to specify it explicitly for expressivenes.
   *
   * Not compatible with the `chardata` option and the union types.
   */
  name?: string | undefined;

  /**
   * If true, the property will be parsed and serialized as an attribute.
   * Not compatible with the `chardata` and `union` options.
   */
  attr?: boolean;

  /**
   * If true, the property will be parsed and serialized as a character data.
   * Not compatible with the `name`, `union`, `array` and `attr` options.
   *
   * It's only useful when you parse elements with a text node and no attributes.
   *
   * @todo maybe we can make it work with primitive unions?
   *
   * ```ts
   * *XmlEntity({ name: 'Comment' })
   * class Comment {
   *   *XmlProperty({ chardata: true })
   *   text: string;
   *
   *   *XmlProperty({ name: 'lang', attr: true })
   *   lenguage: string;
   *
   *   constructor(d?: Comment) {
   *     Object.assign(this, d || {});
   *   }
   * }
   *
   * classToXml(
   *   new Comment({
   *     text: 'This is awesome',
   *     lenguage: 'en',
   *   }),
   * )
   * ```
   *
   * Output:
   * ```xml
   * <Comment lang="en">This is awesome</Comment>
   * ```
   */
  chardata?: boolean;
}

export interface XmlAttributeOptions extends Pick<XmlPropertyOptions, 'name'> {
  /**
   * XML Attributes can only be of primitive types.
   * Specify the primitive type for parsing and serializing the attribute.
   *
   * @example
   * { type: () => String }
   * { type: () => Number }
   * { type: () => Boolean }
   */
  type: () => XmlPrimitiveType;
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
