import xmljs from 'xml-js';
export type AnyClass = {
    new (): any;
};
export type XmlType = typeof String | typeof Number | typeof Boolean | AnyClass;
export interface XmlEntityOptions {
    /**
     * xmlns attribute value.
     * This is just a shortcut for @XmlAttribute({ name: 'xmlns', value: '...' }) property decorator.
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
     * { type: String }
     *
     * You can also specify multiple classes, then the one whose name matches the element name will be selected.
     * @example
     * { type: [Version, DeleteMarker] }
     */
    type: XmlType | XmlType[];
    /**
     * If true, the property will be parsed and serialized as an array.
     * Not compatible with `attr` and `chardata` options.
     */
    array?: boolean;
    /**
     * XML element name.
     * If not specified, the property name will be used.
     * It is highly recommended to specify it explicitly.
     *
     * Not compatible with `chardata` options.
     */
    name?: string | undefined;
    /**
     * If true, the property will be parsed and serialized as an attribute.
     */
    attr?: boolean;
    /**
     * If true, the property will be parsed and serialized as a character data.
     * Not compatible with `array` and `attr` options.
     *
     * It's only useful when you parse elements with a text node and no attributes.
     *
     * @example
     * *XmlEntity({ name: 'Comment' })
     * class Comment {
     *  *XmlProperty({ chardata: true })
     *  text: string;
     *
     *  *XmlProperty({ name: 'lang', attr: true })
     *  lenguage: string;
     *
     *  constructor(d?: Comment) {
     *   Object.assign(this, d || {});
     *  }
     * }
     *
     * classToXml(
     *  new Comment({
     *    text: 'This is awesome',
     *    lenguage: 'en',
     *  })
     * )
     *
     * // Output:
     * <Comment lang="en">This is awesome</Comment>
     */
    chardata?: boolean;
}
/**
 * Class decorator
 */
export declare function XmlEntity(opts?: XmlEntityOptions): ClassDecorator;
/**
 * Class property decorator
 */
export declare function XmlProperty(opts: XmlPropertyOptions): PropertyDecorator;
export declare function xmlToClass<T extends AnyClass>(xml: string, _class: T): InstanceType<T>;
export declare function classToXml(entity: any, options?: xmljs.Options.JS2XML): string;
//# sourceMappingURL=index.d.ts.map