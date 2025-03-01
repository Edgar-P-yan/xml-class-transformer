import xmljs from 'xml-js-v2';
import type { XmlClass } from './types';
export declare function xmlToClass<T extends XmlClass>(xml: string, classConstructor: T, options?: xmljs.Options.XML2JS): InstanceType<T>;
