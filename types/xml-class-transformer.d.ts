import type { AnyClass, ClassToXmlOptions } from './types';
export declare function xmlToClass<T extends AnyClass>(xml: string, _class: T): InstanceType<T>;
export declare function classToXml(entity: any, options?: ClassToXmlOptions): string;
//# sourceMappingURL=xml-class-transformer.d.ts.map