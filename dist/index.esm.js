/*!
 * xml-class-transformer v0.1.1
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
                    throw new Error(`xml-class-transformer: can't use XML element name defined in ` +
                        `{ name: ${JSON.stringify(opts.name)} } for ` +
                        `${clazz.name}#${propertyKey} since it's already used for ` +
                        `${clazz.name}#${searchingPropKey}. Change it to something else.`);
                }
                // TODO: maybe support multiple chardata for multiple child text nodes inside an xml element.
                // each of those chardata properties whould match the text node at the same position as the property itself.
                // The same goes for not yet implemented comments and cdata.
                if (opts.chardata && searchingOpts.chardata) {
                    throw new Error(`xml-class-transformer: an XML element can have only one chardata property. ` +
                        `Both ${clazz.name}#${propertyKey} and ${clazz.name}#${searchingOpts.name} ` +
                        `are defined as chardata, which is not valid.`);
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
                entity: {
                    name: clazz === null || clazz === void 0 ? void 0 : clazz.name,
                },
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

function errUnknownClass(classConstructor) {
    return new Error(`Class "${classConstructor}" not found. Make sure there is a @XmlEntity({...}) decorator on it, or @XmlProperty({...}) decorator on its properties.`);
}
function serializeUnionForLog(union) {
    return ('[' +
        union
            .map((t) => t === null ? 'null' : t === undefined ? 'undefined' : t.name)
            .join(', ') +
        ']');
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
        const text = entity === null ? '' : `${entity}`;
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
        throw new Error(`No XML name is specified for the class "${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}". Specify it with the @XmlEntity({ name: '...' }) decorator.`);
    }
    const children = [];
    const attributes = {};
    meta.properties.forEach((opts, classKey) => {
        var _a;
        // Do not emit attribute if value is undefined,
        if (entity[classKey] === undefined) {
            return;
        }
        if (opts.attr) {
            if (!opts.name) {
                throw new Error(`No name is specified for the property ${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}#${classKey}. Specify it with the @XmlProperty({ name: '...' }) decorator.`);
            }
            attributes[opts.name] =
                entity[classKey] === null ? '' : `${entity[classKey]}`;
        }
        else if (opts.chardata) {
            children.push({
                type: 'text',
                text: entity[classKey] === null ? '' : `${entity[classKey]}`,
            });
        }
        else if (opts.array) {
            if (entity[classKey] === null) {
                return;
            }
            (_a = entity[classKey]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                // Do not process null and undefined values in the array.
                // When we impl support for primitive unions maybe this should change
                if (!e) {
                    return;
                }
                // If it is a union then we can't guess required class out of it.
                // In those cases users should give to the library actual class instances (aka new MyEntity({...}))
                // so the library can guess the class type just by looking at the myEntity.constructor
                const classConstructor = opts.union ? e.constructor : opts.type;
                // The opts.name will be undefined if !!opts.union, but thats ok.
                children.push(classToXmlInternal(e, opts.name, classConstructor));
            });
        }
        else if ([String, Number, Boolean].includes(opts.type)) {
            if (!opts.name) {
                throw new Error(`No name is specified for property ${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}#${classKey}. Specify it with @XmlProperty({ name: '...' }) decorator.`);
            }
            children.push(classToXmlInternal(entity[classKey], opts.name, opts.type));
        }
        else if (opts.union) {
            // should work with primitive types also
            const classConstructor = entity[classKey].constructor;
            children.push(classToXmlInternal(entity[classKey], undefined, classConstructor));
        }
        else {
            // If null then just skip this embedded element for the current impl
            // TODO: maybe non array unions are borken
            if (entity[classKey] !== null) {
                children.push(classToXmlInternal(entity[classKey], opts.name, opts.union ? entity[classKey].constructor : opts.type));
            }
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
    if ([String, Number, Boolean].includes(_class)) {
        const text = getTextForElem(element);
        return parsePrimitive(text, _class);
    }
    const metadatas = registry.get(_class);
    if (!metadatas) {
        throw new Error('Unknown class ' + _class);
    }
    const inst = new _class();
    metadatas.properties.forEach((metadata, key) => {
        var _a, _b, _c, _d, _e;
        if (metadata.attr) {
            if (!metadata.name) {
                throw new Error(`No name is specified for attribute ${key}. Specify it with @XmlProperty({ name: '...' }) decorator.`);
            }
            const attr = (_a = element.attributes) === null || _a === void 0 ? void 0 : _a[metadata.name];
            if (attr !== undefined && attr !== null) {
                inst[key] = parsePrimitive(attr, metadata.type);
            }
            else {
                // If the attribute property is undefined - it means
                // that the attribute was not present in the xml.
                inst[key] = undefined;
            }
        }
        else if (metadata.chardata) {
            inst[key] = xmlToClassInternal(element, metadata.type);
        }
        else if (metadata.array) {
            if (metadata.union) {
                // TODO: optimize and cache this map:
                const tagNameToClassType = new Map();
                metadata.union.forEach((classType) => {
                    const classTypeMetadata = registry.get(classType);
                    if (!classTypeMetadata) {
                        throw errUnknownClass(classType);
                    }
                    const tagName = classTypeMetadata.entity.name;
                    if (!tagName) {
                        throw new Error(`No name is specified for ${classType}. Specify it with the @XmlEntity({ name: '...' }) decorator.`);
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
        else if (metadata.union) {
            // TODO: optimize and cache this map:
            const tagNameToClassType = new Map();
            metadata.union.forEach((classType) => {
                const classTypeMetadata = registry.get(classType);
                if (!classTypeMetadata) {
                    throw errUnknownClass(classType);
                }
                const tagName = classTypeMetadata.entity.name;
                if (!tagName) {
                    throw new Error(`No name is specified for ${classType}. Specify it with the @XmlEntity({ name: '...' }) decorator.`);
                }
                tagNameToClassType.set(tagName, classType);
            });
            const matchingXmlElement = (_d = element.elements) === null || _d === void 0 ? void 0 : _d.find((el) => {
                return el.name && tagNameToClassType.has(el.name);
            });
            inst[key] = matchingXmlElement
                ? xmlToClassInternal(matchingXmlElement, tagNameToClassType.get(matchingXmlElement.name))
                : undefined;
        }
        else {
            const el = (_e = element.elements) === null || _e === void 0 ? void 0 : _e.find((el) => el.name === metadata.name);
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
    return ((_b = (_a = el.elements) === null || _a === void 0 ? void 0 : _a.find((e) => e.type === 'text')) === null || _b === void 0 ? void 0 : _b.text) || '';
}
function parsePrimitive(
// Support numbers also
value, classConstructor) {
    let result = undefined;
    if (value === undefined) {
        result = undefined;
    }
    else {
        const castToStr = `${value}`;
        if (classConstructor === Number) {
            result =
                // parse empty strings to nulls when the specified type is Number
                // bacause there is no convenient way to represent an empty string as a number,
                // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
                // Maybe a better idea would be to convert them to NaN just as parseFloat does.
                castToStr === '' ? null : castToStr ? parseFloat(castToStr) : undefined;
        }
        else if (classConstructor === Boolean) {
            result =
                castToStr === '' ? null : castToStr ? castToStr === 'true' : undefined;
        }
        else {
            // classConstructor is String or any other type, then fallback to String:
            // In case of the string dont cast empty strings to nulls
            result = castToStr;
        }
    }
    return result;
}

/**
 * Class decorator
 */
function XmlEntity(opts) {
    return (target) => {
        opts = opts || {};
        opts.name = opts.name || target.name;
        if (!opts.name) {
            throw new Error(`xml-class-transformer: Failed to get the element name for class ${target}. Specify it with @XmlEntity({ name: '...' }) decorator.`);
        }
        registry.setEntityOptions(target, opts);
        return target;
    };
}
/**
 * Class property decorator.
 */
function XmlProperty(opts) {
    return propertyDecoratorFactory('XmlProperty', opts);
}
function propertyDecoratorFactory(decoratorName, opts) {
    return (target, propertyKey) => {
        if (typeof propertyKey !== 'string') {
            // Dont support symbols for now
            throw new TypeError(`xml-class-transformer: Can't use @${decoratorName}({...}) decorator on a symbol property ` +
                `at ${target.constructor.name}#${propertyKey.toString()}`);
        }
        if (opts.union && opts.type) {
            throw new TypeError(`xml-class-transformer: The "union" option is not compatible with the "type" option at ` +
                `${target.constructor.name}#${propertyKey.toString()}.`);
        }
        if (!opts.union && !opts.type) {
            throw new TypeError(`xml-class-transformer: No "type" or "union" was specified for the ` +
                `${target.constructor.name}#${propertyKey.toString()}. Add it to ` +
                `the @${decoratorName}({...}) decorator.`);
        }
        if (opts.union && !opts.union.length) {
            throw new TypeError(`xml-class-transformer: The "union" option in @${decoratorName}({ ... }) can't be empty ` +
                `at ${target.constructor.name}#${propertyKey.toString()}.`);
        }
        if (opts.union) {
            if (opts.name) {
                throw new TypeError(`xml-class-transformer: The "union" option is not compatible with the "name" option at ` +
                    `${target.constructor.name}#${propertyKey.toString()}. ` +
                    `XML element names for the union memebers should be specified at ` +
                    `the union memeber classes.`);
            }
        }
        else {
            opts.name = opts.name || propertyKey;
        }
        if (opts.union &&
            (opts.union.includes(String) ||
                opts.union.includes(Number) ||
                opts.union.includes(Boolean))) {
            throw new TypeError(`xml-class-transformer: unions of primitive types (String, Number or Boolean) are not supported. ` +
                `Fix it in the decorator @${decoratorName}({ ` +
                `union: ${serializeUnionForLog(opts.union)}, ... }) ` +
                `at "${target.constructor.name}#${propertyKey.toString()}".`);
        }
        registry.setPropertyOptions(target.constructor, propertyKey, opts);
    };
}

export { XmlEntity, XmlProperty, classToXml, xmlToClass };
//# sourceMappingURL=index.esm.js.map
