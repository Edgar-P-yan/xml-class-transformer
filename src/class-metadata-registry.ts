import { errNoXmlNameForClass, errUnknownClass } from './common';
import { InternalXmlPropertyOptions } from './internal-types';
import type { XmlClass, XmlElemOptions } from './types';

type ClassMetadatas = {
  properties: Map<string, InternalXmlPropertyOptions>;
  entity: XmlElemOptions;
};

export class ClassMetadataRegistry {
  private registry = new Map<XmlClass, ClassMetadatas>();

  setEntityOptions(classConstructor: XmlClass, opts: XmlElemOptions): void {
    const metadata = this.registry.get(classConstructor);

    if (metadata) {
      metadata.entity = opts;
    } else {
      this.registry.set(classConstructor, {
        entity: opts,
        properties: new Map(),
      });
    }
  }

  setPropertyOptions(
    classConstr: XmlClass,
    propertyKey: string,
    opts: InternalXmlPropertyOptions,
  ): void {
    const metadata = this.getOrCreate(classConstr);

    if (opts.comments) {
      for (const [searchingPropKey, searchingOpts] of metadata.properties) {
        if (searchingOpts.comments) {
          throw new Error(
            `xml-class-transformer: only one @XmlComment() decorator is allowed per class. ` +
              `Can not define @XmlComment() decorator for  ` +
              `${classConstr.name}#${propertyKey} since it's already used for ` +
              `${classConstr.name}#${searchingPropKey}.`,
          );
        }
      }
    }

    if (opts.name) {
      for (const [searchingPropKey, searchingOpts] of metadata.properties) {
        if (searchingOpts.name === opts.name) {
          throw new Error(
            `xml-class-transformer: can't use XML element name defined in ` +
              `{ name: ${JSON.stringify(opts.name)} } for ` +
              `${classConstr.name}#${propertyKey} since it's already used for ` +
              `${classConstr.name}#${searchingPropKey}. Change it to something else.`,
          );
        }

        // TODO: maybe support multiple chardata for multiple child text nodes inside an xml element.
        // each of those chardata properties whould match the text node at the same position as the property itself.
        // The same goes for not yet implemented comments and cdata.
        if (opts.chardata && searchingOpts.chardata) {
          throw new Error(
            `xml-class-transformer: an XML element can have only one chardata property. ` +
              `Both ${classConstr.name}#${propertyKey} and ${classConstr.name}#${searchingOpts.name} ` +
              `are defined as chardata, which is not valid.`,
          );
        }
      }
    }

    metadata.properties.set(propertyKey, opts);
  }

  private getOrCreate(classConstr: XmlClass): ClassMetadatas {
    const existing = this.registry.get(classConstr);
    if (existing) {
      return existing;
    } else {
      const newMetadatas: ClassMetadatas = {
        entity: {
          name: classConstr?.name,
        },
        properties: new Map(),
      };

      this.registry.set(classConstr, newMetadatas);

      return newMetadatas;
    }
  }

  get(classConstr: XmlClass): ClassMetadatas | undefined {
    return this.registry.get(classConstr);
  }

  resolveUnionComponents(union: XmlClass[]): MapTagToClassConstr {
    // TODO: optimize and cache this map:
    const tagNameToClassType: MapTagToClassConstr = new Map();

    for (const classType of union) {
      const classTypeMetadata = registry.get(classType);

      if (!classTypeMetadata) {
        throw errUnknownClass(classType);
      }

      const tagName = classTypeMetadata.entity.name;

      if (!tagName) {
        throw errNoXmlNameForClass(classType);
      }

      tagNameToClassType.set(tagName, classType);
    }

    return tagNameToClassType;
  }
}

type MapTagToClassConstr = Map<string, XmlClass>;

export const registry = new ClassMetadataRegistry();
