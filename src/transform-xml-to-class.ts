import xmljs from 'xml-js-v2';
import { registry } from './class-metadata-registry';
import type { XmlClass, XmlPrimitiveType, XmlType } from './types';
import {
  errUnknownClass,
  getDefaultMarshaller,
  isPrimitiveType,
} from './common';
import { InternalXmlPropertyOptions } from './internal-types';
import { defaultStringMarshaller } from './marshallers';

export function xmlToClass<T extends XmlClass>(
  xml: string,
  classConstructor: T,
  options?: xmljs.Options.XML2JS,
): InstanceType<T> {
  const parsed = xmljs.xml2js(xml, {
    ...options,
    compact: false,
    alwaysArray: true,
  }) as xmljs.Element;

  const firstElement = parsed.elements?.[0];

  if (!firstElement) {
    throw new Error(
      'xml-class-transformer: No elements found in the xml, make sure its valid.',
    );
  }

  return xmlToClassInternal(firstElement, classConstructor);
}

function xmlToClassInternal(
  xmlElement: xmljs.Element,
  classConstructor: XmlType,
): any {
  if (isPrimitiveType(classConstructor)) {
    const text = getChardataFromElem(xmlElement);

    return unmarshalPrimitiveType(text, classConstructor);
  }

  const metadatas = registry.get(classConstructor);

  if (!metadatas) {
    throw errUnknownClass(classConstructor);
  }

  const classInstance = new classConstructor();

  for (const [classKey, opts] of metadatas.properties) {
    unmarshalProperty(xmlElement, opts, classKey, classInstance);
  }

  return classInstance;
}

function unmarshalProperty(
  xmlElement: xmljs.Element,
  opts: InternalXmlPropertyOptions,
  classKey: string,
  mutClassInstance: any,
) {
  if (opts.comments) {
    unmarshalCommentsProperty(xmlElement, classKey, mutClassInstance);
  } else if (opts.attr) {
    unmarshalAttributeProperty(xmlElement, classKey, opts, mutClassInstance);
  } else if (opts.chardata) {
    unmarshalChardataProperty(xmlElement, classKey, opts, mutClassInstance);
  } else if (opts.array) {
    unmarshalArrayProperty(xmlElement, classKey, opts, mutClassInstance);
  } else if (opts.union) {
    unmarshalUnionProperty(xmlElement, classKey, opts, mutClassInstance);
  } else {
    unmarshalPrimitiveOrChildClassElemProperty(
      xmlElement,
      classKey,
      opts,
      mutClassInstance,
    );
  }
}

function unmarshalCommentsProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  mutClassInstance: any,
) {
  const commentsAccumulated: string[] = [];

  for (const childElem of xmlElement.elements || []) {
    if (childElem.type === 'comment') {
      commentsAccumulated.push(childElem.comment || '');
    }
  }

  mutClassInstance[classKey] = commentsAccumulated;
}

function unmarshalAttributeProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  opts: InternalXmlPropertyOptions,
  mutClassInstance: any,
) {
  if (!opts.name) {
    throw new Error(
      `xml-class-transformer: no name is specified for attribute ${classKey}. ` +
        `Specify it with @XmlAttribute({ name: '...' }) decorator.`,
    );
  }

  let attrValue = xmlElement.attributes?.[opts.name];

  if (typeof attrValue === 'number') {
    attrValue = `${attrValue}`;
  }

  const unmarshalled = unmarshal(attrValue, opts);

  mutClassInstance[classKey] = unmarshalled;
}

function unmarshalChardataProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  opts: InternalXmlPropertyOptions,
  mutClassInstance: any,
) {
  const chardata = getChardataFromElem(xmlElement);

  const unmarshalled = unmarshal(chardata, opts);

  mutClassInstance[classKey] = unmarshalled;
}

function unmarshalArrayProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  opts: InternalXmlPropertyOptions,
  mutClassInstance: any,
) {
  if (opts.union) {
    const mapTagToClassConstr = registry.resolveUnionComponents(opts.union());

    const unmarshalledValues: any[] = [];

    for (const el of xmlElement.elements || []) {
      if (el.name && mapTagToClassConstr.has(el.name)) {
        const classConstr = mapTagToClassConstr.get(el.name)!;

        const entity = xmlToClassInternal(el, classConstr);

        unmarshalledValues.push(entity);
      }
    }

    mutClassInstance[classKey] = unmarshalledValues;
  } else {
    const elems =
      xmlElement.elements?.filter((e) => e.name === opts.name) || [];

    const unmarshalledValues: any[] = [];

    for (const el of elems) {
      const entity = xmlToClassInternal(el, opts.type!() as XmlType);
      unmarshalledValues.push(entity);
    }

    mutClassInstance[classKey] = unmarshalledValues;
  }
}

function unmarshalUnionProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  opts: InternalXmlPropertyOptions,
  mutClassInstance: any,
) {
  const mapTagToClassConstr = registry.resolveUnionComponents(opts.union!());

  const matchingXmlElement = xmlElement.elements?.find((el) => {
    return el.name ? mapTagToClassConstr.has(el.name) : false;
  });

  mutClassInstance[classKey] = matchingXmlElement
    ? xmlToClassInternal(
        matchingXmlElement,
        mapTagToClassConstr.get(matchingXmlElement.name!)!,
      )
    : undefined;
}

function unmarshalPrimitiveOrChildClassElemProperty(
  xmlElement: xmljs.Element,
  classKey: string,
  opts: InternalXmlPropertyOptions,
  mutClassInstance: any,
) {
  // is primitive type, marshaller or child class elem
  const el = xmlElement.elements?.find((el) => el.name === opts.name);

  if (opts.marshaller || opts.isPrimitiveType()) {
    const chardata = el ? getChardataFromElem(el) : undefined;

    const unmarshalled = unmarshal(chardata, opts);

    mutClassInstance[classKey] = unmarshalled;
  } else if (el) {
    mutClassInstance[classKey] = xmlToClassInternal(el, opts.type!());
  } else {
    mutClassInstance[classKey] = undefined;
  }
}

function getChardataFromElem(el: xmljs.Element): string {
  let chardata = '';

  for (const child of el.elements || []) {
    if (child.type === 'text' && child.text) {
      chardata += (child.text as string) || '';
    }
  }

  return chardata;
}

function unmarshal(
  // Support numbers also
  value: string | undefined,
  opts: InternalXmlPropertyOptions,
): any {
  let unmarshalled: any = value;
  if (opts.marshaller) {
    unmarshalled = opts.marshaller.unmarshal(value);
  } else if (opts.type) {
    const type = opts.type();
    if (isPrimitiveType(type)) {
      unmarshalled = getDefaultMarshaller(type).unmarshal(value);
    }
  }

  return unmarshalled;
}

function unmarshalPrimitiveType(
  // Support numbers also
  value: string | number | undefined,
  classConstructor: XmlPrimitiveType | undefined,
): any | null | undefined {
  const defaultMarshaller = classConstructor
    ? getDefaultMarshaller(classConstructor)
    : defaultStringMarshaller;

  const strValue = typeof value === 'number' ? `${value}` : value;

  const unmarshalled = defaultMarshaller.unmarshal(strValue);

  return unmarshalled;
}
