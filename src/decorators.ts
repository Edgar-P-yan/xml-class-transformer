import { registry } from './class-metadata-registry';
import { serializeUnionForLog } from './common';
import type {
  XmlAttributeOptions,
  XmlEntityOptions,
  XmlPropertyOptions,
} from './types';

/**
 * Class decorator
 */
export function XmlEntity(opts?: XmlEntityOptions): ClassDecorator {
  return (target: any): any => {
    opts = opts || {};

    opts.name = opts.name || target.name;

    if (!opts.name) {
      throw new Error(
        `xml-class-transformer: Failed to get the element name for class ${target}. Specify it with @XmlEntity({ name: '...' }) decorator.`,
      );
    }

    registry.setEntityOptions(target, opts);

    return target;
  };
}

/**
 * Class property decorator.
 */
export function XmlProperty(opts: XmlPropertyOptions): PropertyDecorator {
  return propertyDecoratorFactory('XmlProperty', opts);
}

/**
 * Class property decorator.
 * For more details on options see {@link XmlAttributeOptions}
 *
 * @example
 * // a basic example
 * class SomeXmlElement {
 *   *XmlAttribute({ name: 'attributeName', type: () => String })
 *   attributeName: string;
 * }
 */
export function XmlAttribute(opts: XmlAttributeOptions): PropertyDecorator {
  return propertyDecoratorFactory('XmlAttribute', {
    ...opts,
    attr: true,
  });
}

function propertyDecoratorFactory(
  decoratorName: 'XmlAttribute' | 'XmlProperty',
  opts: XmlPropertyOptions,
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

    // opts.union here can potentially return an array of undefineds
    // in case if there are circular dependencies. But that's okay,
    // because we only need to check that the array is not empty.
    if (opts.union && !opts.union().length) {
      throw new TypeError(
        `xml-class-transformer: The "union" option in @${decoratorName}({ ... }) can't be empty ` +
          `at ${target.constructor.name}#${propertyKey.toString()}.`,
      );
    }

    if (opts.union) {
      if (opts.name) {
        throw new TypeError(
          `xml-class-transformer: The "union" option is not compatible with the "name" option at ` +
            `${target.constructor.name}#${propertyKey.toString()}. ` +
            `XML element names for the union memebers should be specified at ` +
            `the union memeber classes.`,
        );
      }
    } else {
      opts.name = opts.name || propertyKey;
    }

    if (
      opts.union &&
      // opts.union() can potentially return undefineds in case if there are circular dependencies.
      // But the primitive values constructors (String, Number and Boolean) are always defined.
      // So it's okay to check them like this:
      (opts.union().includes(String) ||
        opts.union().includes(Number) ||
        opts.union().includes(Boolean))
    ) {
      throw new TypeError(
        `xml-class-transformer: unions of primitive types (String, Number or Boolean) are not supported. ` +
          `Fix it in the decorator @${decoratorName}({ ` +
          `union: ${serializeUnionForLog(opts.union())}, ... }) ` +
          `at "${target.constructor.name}#${propertyKey.toString()}".`,
      );
    }

    registry.setPropertyOptions(target.constructor, propertyKey, opts);
  };
}
