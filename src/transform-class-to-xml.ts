import xmljs from 'xml-js-v2';
import { registry } from './class-metadata-registry';
import { ClassToXmlOptions, XmlPrimitiveType, XmlType } from './types';
import {
  errNoXmlNameForClass,
  errUnknownClass,
  getDefaultMarshaller,
  isPrimitiveType,
} from './common';
import { InternalXmlPropertyOptions } from './internal-types';

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
    return primitiveTypeToXml(entity, name, entityConstructor);
  }

  const metadatas = registry.get(entityConstructor!);

  if (!metadatas) {
    throw errUnknownClass(entityConstructor);
  }

  const elemName = name || metadatas.entity.name;

  if (!elemName) {
    throw errNoXmlNameForClass(entityConstructor);
  }

  const mutChildren: xmljs.Element[] = [];
  const mutAttributes: xmljs.Attributes = {};

  for (const [classKey, opts] of metadatas.properties) {
    marshalProperty(
      entityConstructor,
      entity,
      opts,
      classKey,
      mutChildren,
      mutAttributes,
    );
  }

  if (metadatas.entity.xmlns) {
    mutAttributes['xmlns'] = metadatas.entity.xmlns;
  }

  return {
    type: 'element',
    name: elemName,
    attributes: mutAttributes,
    elements: mutChildren,
  };
}

function primitiveTypeToXml(
  value: any,
  name: string | undefined,
  entityConstructor: XmlPrimitiveType,
): xmljs.Element {
  const defaultMarshaller = getDefaultMarshaller(entityConstructor);
  const text = defaultMarshaller.marshal(value);

  if (text === undefined) {
    // should never happen, but just in case
    return {};
  }

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

function marshalProperty(
  containerEntityConstructor: XmlType,
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutChildren: xmljs.Element[],
  mutAttributes: xmljs.Attributes,
) {
  if (opts.comments) {
    marshalCommentsProperty(entity, classKey, mutChildren);
  } else if (opts.attr) {
    marshalAttributeProperty(
      containerEntityConstructor,
      entity,
      opts,
      classKey,
      mutAttributes,
    );
  } else if (opts.chardata) {
    marshalChardataProperty(entity, opts, classKey, mutChildren);
  } else if (opts.array) {
    marshalArrayProperty(entity, opts, classKey, mutChildren);
  } else if (opts.marshaller || opts.isPrimitiveType()) {
    marshalPrimitiveTypeProperty(
      containerEntityConstructor,
      entity,
      opts,
      classKey,
      mutChildren,
    );
  } else if (opts.union) {
    marshalUnionProperty(entity, classKey, mutChildren);
  } else {
    marshalChildClassElemProperty(entity, opts, classKey, mutChildren);
  }
}

function marshalCommentsProperty(
  entity: any,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  if (Array.isArray(entity[classKey])) {
    for (const comment of entity[classKey]) {
      mutChildren.push({
        type: 'comment',
        comment: comment === null || comment === undefined ? '' : `${comment}`,
      });
    }
  }
}

function marshalAttributeProperty(
  containerEntityConstructor: XmlType,
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutAttributes: xmljs.Attributes,
) {
  if (!opts.name) {
    throw new Error(
      `xml-class-transformer: no name is specified for the property ${containerEntityConstructor?.name}#${classKey}. ` +
        `Specify it with the @XmlAttribute({ name: '...' }) decorator.`,
    );
  }

  const value = marshal(entity[classKey], opts);

  if (value === undefined) {
    return;
  }

  mutAttributes[opts.name] = `${value}`;
}

function marshalChardataProperty(
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  const value = marshal(entity[classKey], opts);

  if (value === undefined) {
    return;
  }

  mutChildren.push({
    type: 'text',
    text: value,
  });
}

function marshalArrayProperty(
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  if (entity[classKey] === null || entity[classKey] === undefined) {
    return;
  }

  for (const entityFromArray of entity[classKey]) {
    if (opts.marshaller || opts.isPrimitiveType()) {
      const marshalledValue = marshal(entityFromArray, opts);

      if (marshalledValue === undefined) {
        continue;
      }

      mutChildren.push(primitiveTypeToXml(entityFromArray, opts.name, String));
    } else {
      // Do not process null and undefined values in the array.
      // When we impl support for primitive unions maybe this should change
      if (entityFromArray === null || entityFromArray === undefined) {
        continue;
      }

      // If it is a union then we can't guess required class out of it.
      // In those cases users should give to the library actual class instances (aka new MyEntity({...}))
      // so the library can guess the class type just by looking at the myEntity.constructor
      const classConstructor = opts.union
        ? entityFromArray.constructor
        : opts.type!();

      // The opts.name will be undefined if !!opts.union, but thats ok.
      mutChildren.push(
        classToXmlInternal(entityFromArray, opts.name, classConstructor),
      );
    }
  }
}

function marshalPrimitiveTypeProperty(
  containerEntityConstructor: XmlType,
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  if (!opts.name) {
    throw new Error(
      `xml-class-transformer: no name is specified for property ${containerEntityConstructor?.name}#${classKey}. ` +
        `Specify it with @XmlChildElem({ name: '...' }) decorator.`,
    );
  }

  const value = marshal(entity[classKey], opts);

  if (value === undefined) {
    return;
  }

  mutChildren.push(primitiveTypeToXml(value, opts.name, String));
}

function marshalUnionProperty(
  entity: any,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  // should work with primitive types also
  const classConstructor = entity[classKey].constructor;

  mutChildren.push(
    classToXmlInternal(entity[classKey], undefined, classConstructor),
  );
}

function marshalChildClassElemProperty(
  entity: any,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutChildren: xmljs.Element[],
) {
  // If null then just skip this embedded element for the current impl
  // TODO: maybe non array unions are broken
  if (entity[classKey] !== undefined && entity[classKey] !== null) {
    mutChildren.push(
      classToXmlInternal(entity[classKey], opts.name, opts.type!()),
    );
  }
}

function marshal(
  value: any,
  opts: InternalXmlPropertyOptions,
): string | undefined {
  let marshalled = value;
  if (opts.marshaller) {
    marshalled = opts.marshaller.marshal(value);
  } else if (opts.type) {
    const type = opts.type();
    if (isPrimitiveType(type)) {
      marshalled = getDefaultMarshaller(type).marshal(value);
    }
  }

  return marshalled;
}
