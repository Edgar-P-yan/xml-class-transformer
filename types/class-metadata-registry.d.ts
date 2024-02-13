import { InternalXmlPropertyOptions } from './internal-types';
import type { XmlClass, XmlElemOptions } from './types';
type ClassMetadatas = {
    properties: Map<string, InternalXmlPropertyOptions>;
    entity: XmlElemOptions;
};
export declare class ClassMetadataRegistry {
    private registry;
    setEntityOptions(xClass: XmlClass, opts: XmlElemOptions): void;
    setPropertyOptions(xClass: XmlClass, propertyKey: string, opts: InternalXmlPropertyOptions): void;
    private getOrCreate;
    get(xClass: XmlClass): ClassMetadatas | undefined;
}
export declare const registry: ClassMetadataRegistry;
export {};
//# sourceMappingURL=class-metadata-registry.d.ts.map