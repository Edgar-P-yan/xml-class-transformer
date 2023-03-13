import { registry } from './class-metadata-registry';
import type { XmlEntityOptions, XmlPropertyOptions } from './types';

/**
 * Class decorator
 */
export function XmlEntity(opts?: XmlEntityOptions): ClassDecorator {
  return (target: any): any => {
    opts = opts || {};

    opts.name = opts.name || target.name;

    if (!opts.name) {
      throw new Error(
        `Failed to get the element name for class ${target}. Specify it with @XmlEntity({ name: '...' }) decorator.`,
      );
    }

    registry.setEntityOptions(target, opts);

    return target;
  };
}

/**
 * Class property decorator
 */
export function XmlProperty(opts: XmlPropertyOptions): PropertyDecorator {
  return (target: { constructor: any }, propertyKey: string | symbol): void => {
    opts.name === opts.name || propertyKey;

    if (typeof propertyKey !== 'string') {
      throw new TypeError(
        `Can't use @XmlProperty({...}) decorator on symbol property at ${
          target.constructor.name
        }#${propertyKey.toString()}`,
      );
    }

    registry.setPropertyOptions(target.constructor, propertyKey, opts);
  };
}
