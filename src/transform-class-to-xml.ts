import xmljs from 'xml-js-v2';
import { registry } from './class-metadata-registry';
import { ClassToXmlOptions, XmlType } from './types';
import { errUnknownClass, isPrimitiveType } from './common';

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
  name: string | undefined,
  entityConstructor: XmlType,
): xmljs.Element {
  if (isPrimitiveType(entityConstructor)) {
    const text = entity === null ? '' : `${entity}`;

    return {
      type: 'element',
      name: name!,
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
      `xml-class-transformer: no XML name is specified for the class "${entityConstructor?.name}". Specify it with the @XmlElem({ name: '...' }) decorator.`,
    );
  }

  const children: xmljs.Element[] = [];

  const attributes: xmljs.Attributes = {};

  meta.properties.forEach((opts, classKey) => {
    // Do not emit attribute if value is undefined,
    if (entity[classKey] === undefined) {
      return;
    }

    if (opts.comments) {
      if (Array.isArray(entity[classKey])) {
        for (const comment of entity[classKey]) {
          children.push({
            type: 'comment',
            comment:
              comment === null || comment === undefined ? '' : `${comment}`,
          });
        }
      }
    } else if (opts.attr) {
      if (!opts.name) {
        throw new Error(
          `xml-class-transformer: no name is specified for the property ${entityConstructor?.name}#${classKey}. Specify it with the @XmlAttribute({ name: '...' }) decorator.`,
        );
      }

      attributes[opts.name] =
        entity[classKey] === null ? '' : `${entity[classKey]}`;
    } else if (opts.chardata) {
      children.push({
        type: 'text',
        text: entity[classKey] === null ? '' : `${entity[classKey]}`,
      });
    } else if (opts.array) {
      if (entity[classKey] === null) {
        return;
      }

      entity[classKey]?.forEach((e: any) => {
        // Do not process null and undefined values in the array.
        // When we impl support for primitive unions maybe this should change
        if (!e) {
          return;
        }

        // If it is a union then we can't guess required class out of it.
        // In those cases users should give to the library actual class instances (aka new MyEntity({...}))
        // so the library can guess the class type just by looking at the myEntity.constructor
        const classConstructor = opts.union ? e.constructor : opts.type!();
        // The opts.name will be undefined if !!opts.union, but thats ok.
        children.push(classToXmlInternal(e, opts.name, classConstructor));
      });
    } else if (opts.type && isPrimitiveType(opts.type())) {
      if (!opts.name) {
        throw new Error(
          `xml-class-transformer: no name is specified for property ${entityConstructor?.name}#${classKey}. Specify it with @XmlChildElem({ name: '...' }) decorator.`,
        );
      }
      children.push(
        classToXmlInternal(entity[classKey], opts.name, opts.type()),
      );
    } else if (opts.union) {
      // should work with primitive types also
      const classConstructor = entity[classKey].constructor;

      children.push(
        classToXmlInternal(entity[classKey], undefined, classConstructor),
      );
    } else {
      // If null then just skip this embedded element for the current impl
      // TODO: maybe non array unions are borken
      if (entity[classKey] !== null) {
        children.push(
          classToXmlInternal(
            entity[classKey],
            opts.name,
            opts.union ? entity[classKey].constructor : opts.type!(),
          ),
        );
      }
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
