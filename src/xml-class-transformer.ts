import xmljs from 'xml-js';
import { registry } from './class-metadata-registry';
import type { AnyClass, ClassToXmlOptions, XmlType } from './types';

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

export function classToXml(entity: any, options?: ClassToXmlOptions): string {
  const tree = classToXmlInternal(entity, '', entity.constructor);

  const rootElem: xmljs.Element = { elements: [tree] };

  if (options?.declaration !== false) {
    if (
      typeof options?.declaration === 'object' &&
      options?.declaration !== null
    ) {
      rootElem.declaration = options.declaration;
    } else {
      rootElem.declaration = {
        attributes: { version: '1.0', encoding: 'UTF-8' },
      };
    }
  }

  return xmljs.js2xml(rootElem, options);
}

function classToXmlInternal(
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
        children.push(classToXmlInternal(e, opts.name!, classConstructor));
      });
    } else if ([String, Number, Boolean].includes(opts.type as any)) {
      if (!opts.name) {
        throw new Error(
          `No name is specified for property ${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`,
        );
      }
      children.push(
        classToXmlInternal(entity[opts.name], opts.name, opts.type),
      );
    } else {
      children.push(
        classToXmlInternal(entity[classKey], opts.name!, opts.type),
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
