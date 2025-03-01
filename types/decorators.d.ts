import type { XmlAttributeOptions, XmlChardataOptions, XmlChildElemOptions, XmlElemOptions } from './types';
/**
 * A class decorator.
 * It can be omitted, but only if at least one Xml* property decorator is used on it's properties.
 *
 * @example
 * \@XmlElem()
 * class EmptyXmlElement {}
 *
 * \@XmlElem({ name: 'some-xml-element' })
 * class SomeXmlElement {
 *   \@XmlChildElem()
 *   child: string;
 * }
 *
 * \@XmlElem({ xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/' })
 * class SomeXmlElement {
 *   \@XmlChildElem()
 *   child: string;
 * }
 */
export declare function XmlElem(opts?: XmlElemOptions): ClassDecorator;
/**
 * Class property decorator.
 *
 * @example
 * class SomeElement {
 *   \@XmlChildElem({ type: () => String })
 *   stringElem: string;
 *
 *   \@XmlChildElem({ name: 'someOtherName', type: () => Number })
 *   numberElem: string;
 *
 *   \@XmlChildElem({ type: () => NestedElem })
 *   nestedElem: NestedElem;
 * }
 */
export declare function XmlChildElem(opts: XmlChildElemOptions): PropertyDecorator;
/**
 * Class property decorator.
 * For more details on options see {@link XmlAttributeOptions}
 *
 * @example
 * // a basic example
 * class SomeXmlElement {
 *   \@XmlAttribute({ name: 'attributeName', type: () => String })
 *   attributeName: string;
 * }
 */
export declare function XmlAttribute(opts: XmlAttributeOptions): PropertyDecorator;
/**
 * This decorator, when used on a class property, collects all the comments
 * from the provided XML, turns them into an array of strings and puts them into
 * that property. And vice-versa: at serialization that array of strings gets serialized to set of comments
 * in the resulting XML.
 *
 * @example
 * ```ts
 * class SomeElement {
 *   \@XmlComments()
 *   comments?: string[];
 * }
 *
 * classToXml(
 *   new SomeElement({
 *     comments: ['some comment', 'some other comment']
 *   })
 * )
 * ```
 *
 * Output:
 * ```xml
 * <SomeElement>
 *   <!-- some comment -->
 *   <!-- some other comment -->
 * </SomeElement>
 *
 * ```
 */
export declare function XmlComments(): PropertyDecorator;
/**
 * The property will be parsed and serialized as a character data.
 * The "type" parameter can only be a primitive type: String, Number, Boolean.
 *
 * ```ts
 * \@XmlElem({ name: 'Comment' })
 * class Comment {
 *   \@XmlChardata({ type: () => String })
 *   text: string;
 *
 *   \@XmlAttribute({ type: () => String, name: 'lang' })
 *   language: string;
 *
 *   constructor(d?: Comment) {
 *     Object.assign(this, d || {});
 *   }
 * }
 *
 * classToXml(
 *   new Comment({
 *     text: 'This is awesome',
 *     language: 'en',
 *   }),
 * )
 * ```
 *
 * Output:
 * ```xml
 * <Comment lang="en">This is awesome</Comment>
 * ```
 */
export declare function XmlChardata(opts: XmlChardataOptions): PropertyDecorator;
