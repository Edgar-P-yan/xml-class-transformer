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
    const metadata = this.registry.get(clazz);
    if (metadata) {
      metadata.properties.set(propertyKey, opts);
    } else {
      this.registry.set(clazz, {
        properties: new Map([[propertyKey, opts]]),
        entity: {},
      });
    }
  }

  get(clazz: AnyClass): ClassMetadatas | undefined {
    return this.registry.get(clazz);
  }
}

export const registry = new ClassMetadataRegistry();
