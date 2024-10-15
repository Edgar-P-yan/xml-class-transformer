import xmljs from 'xml-js-v2';
import { registry } from './class-metadata-registry';
import type { XmlClass, XmlPrimitiveType, XmlType } from './types';
import { errUnknownClass, isPrimitiveType } from './common';

export function xmlToClass<T extends XmlClass>(
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

function xmlToClassInternal(element: xmljs.Element, _class: XmlType): any {
  if (isPrimitiveType(_class)) {
    const text = getChardataFromElem(element);

    return parsePrimitive(text, _class);
  }

  const metadatas = registry.get(_class);

  if (!metadatas) {
    throw new Error('Unknown class ' + _class);
  }

  const inst = new _class();

  metadatas.properties.forEach((metadata, key) => {
    if (metadata.comments) {
      const commentsAccumulated: string[] = [];

      for (const childElem of element.elements || []) {
        if (childElem.type === 'comment') {
          commentsAccumulated.push(childElem.comment || '');
        }
      }

      inst[key] = commentsAccumulated;
    } else if (metadata.attr) {
      if (!metadata.name) {
        throw new Error(
          `xml-class-transformer: no name is specified for attribute ${key}. Specify it with @XmlAttribute({ name: '...' }) decorator.`,
        );
      }

      const attr = element.attributes?.[metadata.name];

      if (attr !== undefined && attr !== null) {
        inst[key] = parsePrimitive(attr, metadata.type!() as XmlPrimitiveType);
      } else {
        // If the attribute property is undefined - it means
        // that the attribute was not present in the xml.
        inst[key] = undefined;
      }
    } else if (metadata.chardata) {
      inst[key] = xmlToClassInternal(element, metadata.type!());
    } else if (metadata.array) {
      if (metadata.union) {
        // TODO: optimize and cache this map:
        const tagNameToClassType: Map<string, any> = new Map();

        metadata.union().forEach((classType) => {
          const classTypeMetadata = registry.get(classType);

          if (!classTypeMetadata) {
            throw errUnknownClass(classType);
          }

          const tagName = classTypeMetadata.entity.name;

          if (!tagName) {
            throw new Error(
              `xml-class-transformer: no name is specified for ${classType}. Specify it with the @XmlElem({ name: '...' }) decorator.`,
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
          const entity = xmlToClassInternal(el, metadata.type!() as XmlType);

          resolvedValues.push(entity);
        });

        inst[key] = resolvedValues;
      }
    } else if (metadata.union) {
      // TODO: optimize and cache this map:
      const tagNameToClassType: Map<string, any> = new Map();

      metadata.union().forEach((classType) => {
        const classTypeMetadata = registry.get(classType);

        if (!classTypeMetadata) {
          throw errUnknownClass(classType);
        }

        const tagName = classTypeMetadata.entity.name;

        if (!tagName) {
          throw new Error(
            `xml-class-transformer: no name is specified for ${classType}. Specify it with the @XmlElem({ name: '...' }) decorator.`,
          );
        }

        tagNameToClassType.set(tagName, classType);
      });

      const matchingXmlElement = element.elements?.find((el) => {
        return el.name && tagNameToClassType.has(el.name);
      });

      inst[key] = matchingXmlElement
        ? xmlToClassInternal(
            matchingXmlElement,
            tagNameToClassType.get(matchingXmlElement.name!)!,
          )
        : undefined;
    } else {
      const el = element.elements?.find((el) => el.name === metadata.name);

      if (el) {
        const value: any = xmlToClassInternal(el, metadata.type!());

        inst[key] = value;
      } else {
        inst[key] = undefined;
      }
    }
  });

  return inst;
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

function parsePrimitive(
  // Support numbers also
  value: string | number | undefined,
  classConstructor: XmlPrimitiveType | undefined,
): string | number | bigint | boolean | null | undefined {
  let result: string | number | bigint | boolean | null | undefined = undefined;

  if (value === undefined) {
    result = undefined;
  } else {
    const castToStr = `${value}`;

    if (classConstructor === Number) {
      result =
        // parse empty strings to nulls when the specified type is Number
        // bacause there is no convenient way to represent an empty string as a number,
        // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
        // Maybe a better idea would be to convert them to NaN just as parseFloat does.
        castToStr === '' ? null : parseFloat(castToStr);
    } else if (classConstructor === BigInt) {
      result = castToStr === '' ? null : BigInt(castToStr);
    } else if (classConstructor === Boolean) {
      result = castToStr === '' ? null : castToStr === 'true';
    } else {
      // classConstructor is String or any other type, then fallback to String:
      // In case of the string dont cast empty strings to nulls
      result = castToStr;
    }
  }

  return result;
}
