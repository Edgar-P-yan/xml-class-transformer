import { registry } from './class-metadata-registry';
import { isPrimitiveType, serializeUnionForLog } from './common';
import { InternalXmlPropertyOptions } from './internal-types';
import type {
  XmlAttributeOptions,
  XmlChardataOptions,
  XmlChildElemOptions,
  XmlElemOptions,
} from './types';

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
export function XmlElem(opts?: XmlElemOptions): ClassDecorator {
  return (target: any): any => {
    opts = opts || {};

    opts.name = opts.name || target.name;

    if (!opts.name) {
      throw new Error(
        `xml-class-transformer: Failed to get the element name for class ${target}. Specify it with @XmlElem({ name: '...' }) decorator.`,
      );
    }

    registry.setEntityOptions(target, opts);

    return target;
  };
}

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
export function XmlChildElem(opts: XmlChildElemOptions): PropertyDecorator {
  return propertyDecoratorFactory('XmlChildElem', opts);
}

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
export function XmlAttribute(opts: XmlAttributeOptions): PropertyDecorator {
  return propertyDecoratorFactory('XmlAttribute', {
    ...opts,
    attr: true,
  });
}

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
export function XmlComments(): PropertyDecorator {
  return (target: { constructor: any }, propertyKey: string | symbol): void => {
    if (typeof propertyKey !== 'string') {
      // Dont support symbols for now
      throw new TypeError(
        `xml-class-transformer: Can't use @XmlComments({...}) decorator on a symbol property ` +
          `at ${target.constructor.name}#${propertyKey.toString()}`,
      );
    }

    registry.setPropertyOptions(target.constructor, propertyKey, {
      comments: true,
    });
  };
}

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
export function XmlChardata(opts: XmlChardataOptions): PropertyDecorator {
  return propertyDecoratorFactory('XmlChardata', {
    ...opts,
    chardata: true,
  });
}

function propertyDecoratorFactory(
  decoratorName: 'XmlAttribute' | 'XmlChildElem' | 'XmlChardata',
  opts: InternalXmlPropertyOptions,
): PropertyDecorator {
  return (target: { constructor: any }, propertyKey: string | symbol): void => {
    if (typeof propertyKey !== 'string') {
      // Dont support symbols for now
      throw new TypeError(
        `xml-class-transformer: Can't use @${decoratorName}({...}) decorator on a symbol property ` +
          `at ${target.constructor.name}#${propertyKey.toString()}`,
      );
    }

    if (opts.union && opts.type) {
      throw new TypeError(
        `xml-class-transformer: The "union" option is not compatible with the "type" option at ` +
          `${target.constructor.name}#${propertyKey.toString()}.`,
      );
    }

    if (!opts.union && !opts.type) {
      throw new TypeError(
        `xml-class-transformer: No "type" or "union" was specified for the ` +
          `${target.constructor.name}#${propertyKey.toString()}. Add it to ` +
          `the @${decoratorName}({...}) decorator.`,
      );
    }

    if (opts.union && !opts.union().length) {
      throw new TypeError(
        `xml-class-transformer: The "union" option in @${decoratorName}({ ... }) can't be empty ` +
          `at ${
            target.constructor.name
          }#${propertyKey.toString()}. Either remove the "union" option or provide it with at least one type.`,
      );
    }

    if (opts.union) {
      if (opts.name) {
        throw new TypeError(
          `xml-class-transformer: The "union" option is not compatible with the "name" option at ` +
            `${target.constructor.name}#${propertyKey.toString()}. ` +
            `XML element names for the union members should be specified at ` +
            `the union member classes.`,
        );
      }
    } else {
      opts.name = opts.name || propertyKey;
    }

    if (opts.union) {
      // opts.union() at the moment of running this peace of code can potentially return
      // undefineds as the value of some elements in case if there are circular dependencies.
      // But the primitive values constructors (String, Number and Boolean) are always defined.
      // So it's okay to check them like this:
      const unionArr = opts.union();
      const foundPrimitiveType = unionArr.find((type) => isPrimitiveType(type));

      if (foundPrimitiveType) {
        throw new TypeError(
          `xml-class-transformer: unions of primitive types (String, Number or Boolean) are not supported. ` +
            `Fix it in the decorator @${decoratorName}({ ` +
            `union: ${serializeUnionForLog(unionArr)}, ... }) ` +
            `at "${target.constructor.name}#${propertyKey.toString()}".`,
        );
      }
    }

    registry.setPropertyOptions(target.constructor, propertyKey, opts);
  };
}
