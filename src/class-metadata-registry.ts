import type { AnyClass, XmlEntityOptions, XmlPropertyOptions } from './types';

type ClassMetadatas = {
  properties: Map<string, XmlPropertyOptions>;
  entity: XmlEntityOptions;
};

export class ClassMetadataRegistry {
  private registry = new Map<AnyClass, ClassMetadatas>();

  setEntityOptions(clazz: AnyClass, opts: XmlEntityOptions): void {
    const metadata = this.registry.get(clazz);

    if (metadata) {
      metadata.entity = opts;
    } else {
      this.registry.set(clazz, {
        entity: opts,
        properties: new Map(),
      });
    }
  }

  setPropertyOptions(
    clazz: AnyClass,
    propertyKey: string,
    opts: XmlPropertyOptions,
  ): void {
    const metadata = this.getOrCreate(clazz);

    if (opts.name) {
      for (const [searchingPropKey, searchingOpts] of metadata.properties) {
        if (searchingOpts.name === opts.name) {
          throw new Error(
            `xml-class-transformer: can't use XML element name defined in { name: ${JSON.stringify(
              opts.name,
            )} } for ${clazz.name}#${propertyKey} since it's already used for ${
              clazz.name
            }#${searchingPropKey}. Change it to something else.`,
          );
        }
      }
    }

    metadata.properties.set(propertyKey, opts);
  }

  private getOrCreate(clazz: AnyClass): ClassMetadatas {
    const existing = this.registry.get(clazz);
    if (existing) {
      return existing;
    } else {
      const newMetadatas: ClassMetadatas = {
        entity: {},
        properties: new Map(),
      };

      this.registry.set(clazz, newMetadatas);

      return newMetadatas;
    }
  }

  get(clazz: AnyClass): ClassMetadatas | undefined {
    return this.registry.get(clazz);
  }
}

export const registry = new ClassMetadataRegistry();
