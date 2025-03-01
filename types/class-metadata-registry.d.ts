import { InternalXmlPropertyOptions } from './internal-types';
import type { XmlClass, XmlElemOptions } from './types';
type ClassMetadatas = {
    properties: Map<string, InternalXmlPropertyOptions>;
    entity: XmlElemOptions;
};
export declare class ClassMetadataRegistry {
    private registry;
    setEntityOptions(classConstructor: XmlClass, opts: XmlElemOptions): void;
    setPropertyOptions(classConstr: XmlClass, propertyKey: string, opts: InternalXmlPropertyOptions): void;
    private getOrCreate;
    get(classConstr: XmlClass): ClassMetadatas | undefined;
    resolveUnionComponents(union: XmlClass[]): MapTagToClassConstr;
}
type MapTagToClassConstr = Map<string, XmlClass>;
export declare const registry: ClassMetadataRegistry;
export {};
