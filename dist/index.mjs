/*!
 * xml-class-transformer v0.1.0
 * (c) Edgar Pogosyan
 * Released under the MIT License.
 */

import xmljs from 'xml-js';

class ClassMetadataRegistry {
    constructor() {
        this.registry = new Map();
    }
    setEntityOptions(clazz, opts) {
        const metadata = this.registry.get(clazz);
        if (metadata) {
            metadata.entity = opts;
        }
        else {
            this.registry.set(clazz, {
                entity: opts,
                properties: new Map(),
            });
        }
    }
    setPropertyOptions(clazz, propertyKey, opts) {
        const metadata = this.getOrCreate(clazz);
        if (opts.name) {
            for (const [searchingPropKey, searchingOpts] of metadata.properties) {
                if (searchingOpts.name === opts.name) {
                    throw new Error(`xml-class-transformer: can't use XML element name defined in { name: ${JSON.stringify(opts.name)} } for ${clazz.name}#${propertyKey} since it's already used for ${clazz.name}#${searchingPropKey}. Change it to something else.`);
                }
            }
        }
        metadata.properties.set(propertyKey, opts);
    }
    getOrCreate(clazz) {
        const existing = this.registry.get(clazz);
        if (existing) {
            return existing;
        }
        else {
            const newMetadatas = {
                entity: {},
                properties: new Map(),
            };
            this.registry.set(clazz, newMetadatas);
            return newMetadatas;
        }
    }
    get(clazz) {
        return this.registry.get(clazz);
    }
}
const registry = new ClassMetadataRegistry();

function xmlToClass(xml, _class) {
    var _a;
    const parsed = xmljs.xml2js(xml, {
        compact: false,
        alwaysArray: true,
    });
    const firstElement = (_a = parsed.elements) === null || _a === void 0 ? void 0 : _a[0];
    if (!firstElement) {
        throw new Error('No elements found in xml.');
    }
    return xmlToClassInternal(firstElement, _class);
}
function xmlToClassInternal(element, _class) {
    var _a;
    if ([String, Number, Boolean].includes(_class)) {
        let value = undefined;
        const text = (_a = getTextForElem(element)) === null || _a === void 0 ? void 0 : _a.toString();
        if (_class === String) {
            value = text;
        }
        else if (_class === Number) {
            value = text ? parseInt(text, 10) : undefined;
        }
        else if (_class === Boolean) {
            value = text ? text === 'true' : undefined;
        }
        return value;
    }
    const metadatas = registry.get(_class);
    if (!metadatas) {
        throw new Error('Unknown class ' + _class);
    }
    const inst = new _class();
    metadatas.properties.forEach((metadata, key) => {
        var _a, _b, _c, _d;
        if (metadata.attr) {
            if (!metadata.name) {
                throw new Error(`No name is specified for attribute ${key}. Specify it with @XmlProperty({ name: '...' }) decorator.`);
            }
            const attr = (_a = element.attributes) === null || _a === void 0 ? void 0 : _a[metadata.name];
            if (attr) {
                inst[key] = attr;
            }
            else {
                inst[key] = undefined;
            }
        }
        else if (metadata.chardata) {
            inst[key] = xmlToClassInternal(element, metadata.type);
        }
        else if (metadata.array) {
            if (Array.isArray(metadata.type)) {
                const tagNameToClassType = new Map();
                metadata.type.forEach((classType) => {
                    const classTypeMetadata = registry.get(classType);
                    if (!classTypeMetadata) {
                        throw errUnknownClass(classType);
                    }
                    const tagName = classTypeMetadata.entity.name;
                    if (!tagName) {
                        throw new Error(`No name is specified for ${classType}. Specify it with @XmlEntity({ name: '...' }) decorator.`);
                    }
                    tagNameToClassType.set(tagName, classType);
                });
                const possibleTagNames = [...tagNameToClassType.keys()];
                const resolvedValues = [];
                (_b = element.elements) === null || _b === void 0 ? void 0 : _b.forEach((el) => {
                    if (el.name && possibleTagNames.includes(el.name)) {
                        const classType = tagNameToClassType.get(el.name);
                        const entity = xmlToClassInternal(el, classType);
                        resolvedValues.push(entity);
                    }
                });
                inst[key] = resolvedValues;
            }
            else {
                const elems = ((_c = element.elements) === null || _c === void 0 ? void 0 : _c.filter((e) => e.name === metadata.name)) || [];
                const resolvedValues = [];
                elems.forEach((el) => {
                    const entity = xmlToClassInternal(el, metadata.type);
                    resolvedValues.push(entity);
                });
                inst[key] = resolvedValues;
            }
        }
        else {
            const el = (_d = element.elements) === null || _d === void 0 ? void 0 : _d.find((el) => el.name === metadata.name);
            if (el) {
                const value = xmlToClassInternal(el, metadata.type);
                inst[key] = value;
            }
            else {
                inst[key] = undefined;
            }
        }
    });
    return inst;
}
function getTextForElem(el) {
    var _a, _b;
    return (_b = (_a = el.elements) === null || _a === void 0 ? void 0 : _a.find((e) => e.type === 'text')) === null || _b === void 0 ? void 0 : _b.text;
}
function classToXml(entity, options) {
    const tree = classToXmlInternal(entity, '', entity.constructor);
    const rootElem = { elements: [tree] };
    if ((options === null || options === void 0 ? void 0 : options.declaration) !== false) {
        if (typeof (options === null || options === void 0 ? void 0 : options.declaration) === 'object' &&
            (options === null || options === void 0 ? void 0 : options.declaration) !== null) {
            rootElem.declaration = options.declaration;
        }
        else {
            rootElem.declaration = {
                attributes: { version: '1.0', encoding: 'UTF-8' },
            };
        }
    }
    return xmljs.js2xml(rootElem, options);
}
function classToXmlInternal(entity, name, entityConstructor) {
    if ([String, Number, Boolean].includes(entityConstructor)) {
        const text = entity === null ? '' : entity === null || entity === void 0 ? void 0 : entity.toString();
        return {
            type: 'element',
            name: name,
            elements: [
                {
                    type: 'text',
                    text,
                },
            ],
        };
    }
    const meta = registry.get(entityConstructor);
    if (!meta) {
        throw errUnknownClass(entityConstructor);
    }
    const elemName = name || meta.entity.name;
    if (!elemName) {
        throw new Error(`No name is specified for ${entityConstructor}. Specify it with @XmlEntity({ name: '...' }) decorator.`);
    }
    const children = [];
    const attributes = {};
    meta.properties.forEach((opts, classKey) => {
        var _a;
        if (entity[classKey] === undefined) {
            return;
        }
        if (opts.attr) {
            if (!opts.name) {
                throw new Error(`No name is specified for property ${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`);
            }
            attributes[opts.name] =
                entity[classKey] === null ? '' : entity[classKey].toString();
        }
        else if (opts.chardata) {
            children.push({
                type: 'text',
                text: entity[classKey] === null ? '' : entity[classKey].toString(),
            });
        }
        else if (opts.array) {
            (_a = entity[classKey]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                // If opts.type is an array then we can't guess required class out of it.
                // In those cases users should use class constructors (aka new MyEntity({...}))
                // so the library can guess the class type just by looking at myEntity.constructor
                const classConstructor = Array.isArray(opts.type)
                    ? e.constructor
                    : opts.type;
                children.push(classToXmlInternal(e, opts.name, classConstructor));
            });
        }
        else if ([String, Number, Boolean].includes(opts.type)) {
            if (!opts.name) {
                throw new Error(`No name is specified for property ${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`);
            }
            children.push(classToXmlInternal(entity[opts.name], opts.name, opts.type));
        }
        else {
            children.push(classToXmlInternal(entity[classKey], opts.name, opts.type));
        }
    });
    if (meta.entity.xmlns) {
        attributes['xmlns'] = meta.entity.xmlns;
    }
    return {
        type: 'element',
        name: elemName,
        attributes,
        elements: children,
    };
}
function errUnknownClass(classConstructor) {
    return new Error(`Class ${classConstructor} not found. Make sure there is @XmlEntity({...}) decorator on it, or @XmlProperty({...}) decorator on its properties.`);
}

/**
 * Class decorator
 */
function XmlEntity(opts) {
    return (target) => {
        opts = opts || {};
        opts.name = opts.name || target.name;
        if (!opts.name) {
            throw new Error(`Failed to get the element name for class ${target}. Specify it with @XmlEntity({ name: '...' }) decorator.`);
        }
        registry.setEntityOptions(target, opts);
        return target;
    };
}
/**
 * Class property decorator
 */
function XmlProperty(opts) {
    return (target, propertyKey) => {
        opts.name === opts.name || propertyKey;
        if (typeof propertyKey !== 'string') {
            throw new TypeError(`Can't use @XmlProperty({...}) decorator on symbol property at ${target.constructor.name}#${propertyKey.toString()}`);
        }
        registry.setPropertyOptions(target.constructor, propertyKey, opts);
    };
}

export { XmlEntity, XmlProperty, classToXml, xmlToClass };
//# sourceMappingURL=index.mjs.map
