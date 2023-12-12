import type { XmlClass, XmlEntityOptions, XmlPropertyOptions } from './types';
type ClassMetadatas = {
    properties: Map<string, XmlPropertyOptions>;
    entity: XmlEntityOptions;
};
export declare class ClassMetadataRegistry {
    private registry;
    setEntityOptions(clazz: XmlClass, opts: XmlEntityOptions): void;
    setPropertyOptions(clazz: XmlClass, propertyKey: string, opts: XmlPropertyOptions): void;
    private getOrCreate;
    get(clazz: XmlClass): ClassMetadatas | undefined;
}
export declare const registry: ClassMetadataRegistry;
export {};
//# sourceMappingURL=class-metadata-registry.d.ts.map