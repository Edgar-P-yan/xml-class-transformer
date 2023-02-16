import xmljs from 'xml-js';
export type AnyClass = {
    new (): any;
};
export type XmlType = typeof String | typeof Number | typeof Boolean | AnyClass;
export type XmlEntityOpts = {
    xmlns?: string;
    name?: string;
};
export interface XmlPropertyOpts {
    /**
     * Specify primitive type or class type for parsing.
     * @example
     * { type: String }
     *
     * You can also specify multiple classes, then the one whose name matches the element name will be selected.
     * @example
     * { type: [Version, DeleteMarker] }
     */
    type: XmlType | XmlType[];
    array?: boolean;
    name: string | undefined;
    attr?: boolean;
    chardata?: boolean;
}
/**
 * Class decorator
 */
export declare function XmlEntity(opts: XmlEntityOpts): ClassDecorator;
/**
 * Class property decorator
 */
export declare function XmlProperty(opts: XmlPropertyOpts): PropertyDecorator;
export declare function xmlToClass<T extends AnyClass>(xml: string, _class: T): InstanceType<T>;
export declare function classToXml(entity: any, options?: xmljs.Options.JS2XML): string;
//# sourceMappingURL=index.d.ts.map