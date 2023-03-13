import type { AnyClass, XmlEntityOptions, XmlPropertyOptions } from './types';
type ClassMetadatas = {
    properties: Map<string, XmlPropertyOptions>;
    entity: XmlEntityOptions;
};
export declare class ClassMetadataRegistry {
    private registry;
    setEntityOptions(clazz: AnyClass, opts: XmlEntityOptions): void;
    setPropertyOptions(clazz: AnyClass, propertyKey: string, opts: XmlPropertyOptions): void;
    get(clazz: AnyClass): ClassMetadatas | undefined;
}
export declare const registry: ClassMetadataRegistry;
export {};
//# sourceMappingURL=class-metadata-registry.d.ts.map