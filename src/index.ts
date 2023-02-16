import xmljs from 'xml-js';

export type AnyClass = { new (): any };

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

type ClassMetadatas = {
  properties: Map<string, XmlPropertyOptions>;
  entity: XmlEntityOptions;
};

const registry: Map<AnyClass, ClassMetadatas> = new Map();

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

    const metadata = registry.get(target);

    if (metadata) {
      metadata.entity = opts;
    } else {
      registry.set(target, {
        entity: opts,
        properties: new Map(),
      });
    }

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

    const metadata = registry.get(target.constructor);
    if (metadata) {
      metadata.properties.set(propertyKey, opts);
    } else {
      registry.set(target.constructor, {
        properties: new Map([[propertyKey, opts]]),
        entity: {},
      });
    }
  };
}

export function xmlToClass<T extends AnyClass>(
  xml: string,
  _class: T,
): InstanceType<T> {
  const parsed = xmljs.xml2js(xml, {
    compact: false,
    alwaysArray: true,
  }) as xmljs.Element;

  const firstElement = parsed.elements?.[0];

  if (!firstElement) {
    throw new Error('No elements found in xml.');
  }

  return xmlToClassInternal(firstElement, _class);
}

function xmlToClassInternal(element: xmljs.Element, _class: any): any {
  if ([String, Number, Boolean].includes(_class)) {
    let value: unknown = undefined;

    const text = getTextForElem(element)?.toString();

    if (_class === String) {
      value = text;
    } else if (_class === Number) {
      value = text ? parseInt(text, 10) : undefined;
    } else if (_class === Boolean) {
      value = text ? text === 'true' : undefined;
    }

    return value;
  }

  const metadatas = registry.get(_class);

  if (!metadatas) {
    throw new Error('Unknown class ' + _class);
  }

  const inst = new _class();

  metadatas.properties.forEach((metadata, key) => {
    if (metadata.attr) {
      if (!metadata.name) {
        throw new Error(
          `No name is specified for attribute ${key}. Specify it with @XmlProperty({ name: '...' }) decorator.`,
        );
      }

      const attr = element.attributes?.[metadata.name];

      if (attr) {
        inst[key] = attr;
      } else {
        inst[key] = undefined;
      }
    } else if (metadata.chardata) {
      inst[key] = xmlToClassInternal(element, metadata.type);
    } else if (metadata.array) {
      if (Array.isArray(metadata.type)) {
        const tagNameToClassType: Map<string, any> = new Map();

        metadata.type.forEach((classType) => {
          const classTypeMetadata = registry.get(classType);

          if (!classTypeMetadata) {
            throw errUnknownClass(classType);
          }

          const tagName = classTypeMetadata.entity.name;

          if (!tagName) {
            throw new Error(
              `No name is specified for ${classType}. Specify it with @XmlEntity({ name: '...' }) decorator.`,
            );
          }

          tagNameToClassType.set(tagName, classType);
        });

        const possibleTagNames = [...tagNameToClassType.keys()];

        const resolvedValues: any[] = [];

        element.elements?.forEach((el) => {
          if (el.name && possibleTagNames.includes(el.name)) {
            const classType = tagNameToClassType.get(el.name);

            const entity = xmlToClassInternal(el, classType);

            resolvedValues.push(entity);
          }
        });

        inst[key] = resolvedValues;
      } else {
        const elems =
          element.elements?.filter((e) => e.name === metadata.name) || [];

        const resolvedValues: any[] = [];

        elems.forEach((el) => {
          const entity = xmlToClassInternal(el, metadata.type as XmlType);

          resolvedValues.push(entity);
        });

        inst[key] = resolvedValues;
      }
    } else {
      const el = element.elements?.find((el) => el.name === metadata.name);

      if (el) {
        const value: any = xmlToClassInternal(el, metadata.type);

        inst[key] = value;
      } else {
        inst[key] = undefined;
      }
    }
  });

  return inst;
}

function getTextForElem(el: xmljs.Element): string | undefined {
  return el.elements?.find((e) => e.type === 'text')?.text as string;
}

export function classToXml(
  entity: any,
  options?: xmljs.Options.JS2XML,
): string {
  const tree = buildXmlFromClassInternal(entity, '', entity.constructor);

  return xmljs.js2xml(
    {
      declaration: { attributes: { version: '1.0', encoding: 'UTF-8' } },
      elements: [tree],
    },
    options,
  );
}

function buildXmlFromClassInternal(
  entity: any,
  name: string,
  entityConstructor: any,
): xmljs.Element {
  if ([String, Number, Boolean].includes(entityConstructor)) {
    const text = entity === null ? '' : entity?.toString();

    return {
      type: 'element',
      name: name,
      elements: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  const meta = registry.get(entityConstructor);

  if (!meta) {
    throw errUnknownClass(entityConstructor);
  }

  const elemName = name || meta.entity.name;

  if (!elemName) {
    throw new Error(
      `No name is specified for ${entityConstructor}. Specify it with @XmlEntity({ name: '...' }) decorator.`,
    );
  }

  const children: xmljs.Element[] = [];

  const attributes: xmljs.Attributes = {};

  meta.properties.forEach((opts, classKey) => {
    if (entity[classKey] === undefined) {
      return;
    }

    if (opts.attr) {
      if (!opts.name) {
        throw new Error(
          `No name is specified for property ${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`,
        );
      }
      attributes[opts.name] =
        entity[classKey] === null ? '' : entity[classKey].toString();
    } else if (opts.chardata) {
      children.push({
        type: 'text',
        text: entity[classKey] === null ? '' : entity[classKey].toString(),
      });
    } else if (opts.array) {
      entity[classKey]?.forEach((e: any) => {
        // If opts.type is an array then we can't guess required class out of it.
        // In those cases users should use class constructors (aka new MyEntity({...}))
        // so the library can guess the class type just by looking at myEntity.constructor
        const classConstructor = Array.isArray(opts.type)
          ? e.constructor
          : opts.type;
        children.push(
          buildXmlFromClassInternal(e, opts.name!, classConstructor),
        );
      });
    } else if ([String, Number, Boolean].includes(opts.type as any)) {
      if (!opts.name) {
        throw new Error(
          `No name is specified for property ${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`,
        );
      }
      children.push(
        buildXmlFromClassInternal(entity[opts.name], opts.name, opts.type),
      );
    } else {
      children.push(
        buildXmlFromClassInternal(entity[classKey], opts.name!, opts.type),
      );
    }
  });

  if (meta.entity.xmlns) {
    attributes['xmlns'] = meta.entity.xmlns;
  }

  return {
    type: 'element',
    name: elemName,
    attributes,
    elements: children,
  };
}

function errUnknownClass(classConstructor: any): Error {
  return new Error(
    `Class ${classConstructor} not found. Make sure there is @XmlEntity({...}) decorator on it, or @XmlProperty({...}) decorator on its properties.`,
  );
}
