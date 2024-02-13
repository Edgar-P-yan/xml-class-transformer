import { InternalXmlPropertyOptions } from './internal-types';
import type { XmlClass, XmlElemOptions } from './types';

type ClassMetadatas = {
  properties: Map<string, InternalXmlPropertyOptions>;
  entity: XmlElemOptions;
};

export class ClassMetadataRegistry {
  private registry = new Map<XmlClass, ClassMetadatas>();

  setEntityOptions(xClass: XmlClass, opts: XmlElemOptions): void {
    const metadata = this.registry.get(xClass);

    if (metadata) {
      metadata.entity = opts;
    } else {
      this.registry.set(xClass, {
        entity: opts,
        properties: new Map(),
      });
    }
  }

  setPropertyOptions(
    xClass: XmlClass,
    propertyKey: string,
    opts: InternalXmlPropertyOptions,
  ): void {
    const metadata = this.getOrCreate(xClass);

    if (opts.comments) {
      for (const [searchingPropKey, searchingOpts] of metadata.properties) {
        if (searchingOpts.comments) {
          throw new Error(
            `xml-class-transformer: only one @XmlComment() decorator is allowed per class. ` +
              `Can not define @XmlComment() decorator for  ` +
              `${xClass.name}#${propertyKey} since it's already used for ` +
              `${xClass.name}#${searchingPropKey}.`,
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
              `${xClass.name}#${propertyKey} since it's already used for ` +
              `${xClass.name}#${searchingPropKey}. Change it to something else.`,
          );
        }

        // TODO: maybe support multiple chardata for multiple child text nodes inside an xml element.
        // each of those chardata properties whould match the text node at the same position as the property itself.
        // The same goes for not yet implemented comments and cdata.
        if (opts.chardata && searchingOpts.chardata) {
          throw new Error(
            `xml-class-transformer: an XML element can have only one chardata property. ` +
              `Both ${xClass.name}#${propertyKey} and ${xClass.name}#${searchingOpts.name} ` +
              `are defined as chardata, which is not valid.`,
          );
        }
      }
    }

    metadata.properties.set(propertyKey, opts);
  }

  private getOrCreate(xClass: XmlClass): ClassMetadatas {
    const existing = this.registry.get(xClass);
    if (existing) {
      return existing;
    } else {
      const newMetadatas: ClassMetadatas = {
        entity: {
          name: xClass?.name,
        },
        properties: new Map(),
      };

      this.registry.set(xClass, newMetadatas);

      return newMetadatas;
    }
  }

  get(xClass: XmlClass): ClassMetadatas | undefined {
    return this.registry.get(xClass);
  }
}

export const registry = new ClassMetadataRegistry();
