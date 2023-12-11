import type { XmlAttributeOptions, XmlEntityOptions, XmlPropertyOptions } from './types';
/**
 * Class decorator
 */
export declare function XmlEntity(opts?: XmlEntityOptions): ClassDecorator;
/**
 * Class property decorator.
 */
export declare function XmlProperty(opts: XmlPropertyOptions): PropertyDecorator;
/**
 * Class property decorator.
 * For more details on options see {@link XmlAttributeOptions}
 *
 * @example
 * // a basic example
 * class SomeXmlElement {
 *   *XmlAttribute({ name: 'attributeName', type: String })
 *   attributeName: string;
 * }
 */
export declare function XmlAttribute(opts: XmlAttributeOptions): PropertyDecorator;
//# sourceMappingURL=decorators.d.ts.map