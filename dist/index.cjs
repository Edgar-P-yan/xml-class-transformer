/*!
 * xml-class-transformer v2.0.0-alpha.0
 * (c) Edgar Pogosyan
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var xmljs = require('xml-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var xmljs__default = /*#__PURE__*/_interopDefaultLegacy(xmljs);

class ClassMetadataRegistry {
    constructor() {
        this.registry = new Map();
    }
    setEntityOptions(xClass, opts) {
        const metadata = this.registry.get(xClass);
        if (metadata) {
            metadata.entity = opts;
        }
        else {
            this.registry.set(xClass, {
                entity: opts,
                properties: new Map(),
            });
        }
    }
    setPropertyOptions(xClass, propertyKey, opts) {
        const metadata = this.getOrCreate(xClass);
        if (opts.comments) {
            for (const [searchingPropKey, searchingOpts] of metadata.properties) {
                if (searchingOpts.comments) {
                    throw new Error(`xml-class-transformer: only one @XmlComment() decorator is allowed per class. ` +
                        `Can not define @XmlComment() decorator for  ` +
                        `${xClass.name}#${propertyKey} since it's already used for ` +
                        `${xClass.name}#${searchingPropKey}.`);
                }
            }
        }
        if (opts.name) {
            for (const [searchingPropKey, searchingOpts] of metadata.properties) {
                if (searchingOpts.name === opts.name) {
                    throw new Error(`xml-class-transformer: can't use XML element name defined in ` +
                        `{ name: ${JSON.stringify(opts.name)} } for ` +
                        `${xClass.name}#${propertyKey} since it's already used for ` +
                        `${xClass.name}#${searchingPropKey}. Change it to something else.`);
                }
                // TODO: maybe support multiple chardata for multiple child text nodes inside an xml element.
                // each of those chardata properties whould match the text node at the same position as the property itself.
                // The same goes for not yet implemented comments and cdata.
                if (opts.chardata && searchingOpts.chardata) {
                    throw new Error(`xml-class-transformer: an XML element can have only one chardata property. ` +
                        `Both ${xClass.name}#${propertyKey} and ${xClass.name}#${searchingOpts.name} ` +
                        `are defined as chardata, which is not valid.`);
                }
            }
        }
        metadata.properties.set(propertyKey, opts);
    }
    getOrCreate(xClass) {
        const existing = this.registry.get(xClass);
        if (existing) {
            return existing;
        }
        else {
            const newMetadatas = {
                entity: {
                    name: xClass === null || xClass === void 0 ? void 0 : xClass.name,
                },
                properties: new Map(),
            };
            this.registry.set(xClass, newMetadatas);
            return newMetadatas;
        }
    }
    get(xClass) {
        return this.registry.get(xClass);
    }
}
const registry = new ClassMetadataRegistry();

function errUnknownClass(classConstructor) {
    return new Error(`xml-class-transformer: class "${classConstructor}" not found. Make sure there is a @XmlElem({...}) ` +
        `decorator on it, or XmlChildElem, XmlAttribute, XmlChardata or XmlComments decorator on its properties.`);
}
function serializeUnionForLog(union) {
    return '[' + union.map((t) => { var _a; return (_a = t === null || t === void 0 ? void 0 : t.name) !== null && _a !== void 0 ? _a : `${union}`; }).join(', ') + ']';
}
function isPrimitiveType(type) {
    return (type === String || type === Number || type === BigInt || type === Boolean);
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
    return xmljs__default["default"].js2xml(rootElem, options);
}
function classToXmlInternal(entity, name, entityConstructor) {
    if (isPrimitiveType(entityConstructor)) {
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
        throw new Error(`xml-class-transformer: no XML name is specified for the class "${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}". Specify it with the @XmlElem({ name: '...' }) decorator.`);
    }
    const children = [];
    const attributes = {};
    meta.properties.forEach((opts, classKey) => {
        var _a;
        // Do not emit attribute if value is undefined,
        if (entity[classKey] === undefined) {
            return;
        }
        if (opts.comments) {
            if (Array.isArray(entity[classKey])) {
                for (const comment of entity[classKey]) {
                    children.push({
                        type: 'comment',
                        comment: comment === null || comment === undefined ? '' : `${comment}`,
                    });
                }
            }
        }
        else if (opts.attr) {
            if (!opts.name) {
                throw new Error(`xml-class-transformer: no name is specified for the property ${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}#${classKey}. Specify it with the @XmlAttribute({ name: '...' }) decorator.`);
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
                const classConstructor = opts.union ? e.constructor : opts.type();
                // The opts.name will be undefined if !!opts.union, but thats ok.
                children.push(classToXmlInternal(e, opts.name, classConstructor));
            });
        }
        else if (opts.type && isPrimitiveType(opts.type())) {
            if (!opts.name) {
                throw new Error(`xml-class-transformer: no name is specified for property ${entityConstructor === null || entityConstructor === void 0 ? void 0 : entityConstructor.name}#${classKey}. Specify it with @XmlChildElem({ name: '...' }) decorator.`);
            }
            children.push(classToXmlInternal(entity[classKey], opts.name, opts.type()));
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
                children.push(classToXmlInternal(entity[classKey], opts.name, opts.union ? entity[classKey].constructor : opts.type()));
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
    const parsed = xmljs__default["default"].xml2js(xml, {
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
    if (isPrimitiveType(_class)) {
        const text = getChardataFromElem(element);
        return parsePrimitive(text, _class);
    }
    const metadatas = registry.get(_class);
    if (!metadatas) {
        throw new Error('Unknown class ' + _class);
    }
    const inst = new _class();
    metadatas.properties.forEach((metadata, key) => {
        var _a, _b, _c, _d, _e;
        if (metadata.comments) {
            const commentsAccumulated = [];
            for (const childElem of element.elements || []) {
                if (childElem.type === 'comment') {
                    commentsAccumulated.push(childElem.comment || '');
                }
            }
            inst[key] = commentsAccumulated;
        }
        else if (metadata.attr) {
            if (!metadata.name) {
                throw new Error(`xml-class-transformer: no name is specified for attribute ${key}. Specify it with @XmlAttribute({ name: '...' }) decorator.`);
            }
            const attr = (_a = element.attributes) === null || _a === void 0 ? void 0 : _a[metadata.name];
            if (attr !== undefined && attr !== null) {
                inst[key] = parsePrimitive(attr, metadata.type());
            }
            else {
                // If the attribute property is undefined - it means
                // that the attribute was not present in the xml.
                inst[key] = undefined;
            }
        }
        else if (metadata.chardata) {
            inst[key] = xmlToClassInternal(element, metadata.type());
        }
        else if (metadata.array) {
            if (metadata.union) {
                // TODO: optimize and cache this map:
                const tagNameToClassType = new Map();
                metadata.union().forEach((classType) => {
                    const classTypeMetadata = registry.get(classType);
                    if (!classTypeMetadata) {
                        throw errUnknownClass(classType);
                    }
                    const tagName = classTypeMetadata.entity.name;
                    if (!tagName) {
                        throw new Error(`xml-class-transformer: no name is specified for ${classType}. Specify it with the @XmlElem({ name: '...' }) decorator.`);
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
                    const entity = xmlToClassInternal(el, metadata.type());
                    resolvedValues.push(entity);
                });
                inst[key] = resolvedValues;
            }
        }
        else if (metadata.union) {
            // TODO: optimize and cache this map:
            const tagNameToClassType = new Map();
            metadata.union().forEach((classType) => {
                const classTypeMetadata = registry.get(classType);
                if (!classTypeMetadata) {
                    throw errUnknownClass(classType);
                }
                const tagName = classTypeMetadata.entity.name;
                if (!tagName) {
                    throw new Error(`xml-class-transformer: no name is specified for ${classType}. Specify it with the @XmlElem({ name: '...' }) decorator.`);
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
                const value = xmlToClassInternal(el, metadata.type());
                inst[key] = value;
            }
            else {
                inst[key] = undefined;
            }
        }
    });
    return inst;
}
function getChardataFromElem(el) {
    let chardata = '';
    for (const child of el.elements || []) {
        if (child.type === 'text' && child.text) {
            chardata += child.text || '';
        }
    }
    return chardata;
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
                castToStr === '' ? null : parseFloat(castToStr);
        }
        else if (classConstructor === BigInt) {
            result = castToStr === '' ? null : BigInt(castToStr);
        }
        else if (classConstructor === Boolean) {
            result = castToStr === '' ? null : castToStr === 'true';
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
 * A class decorator.
 * It can be omitted, but only if at least one Xml* property decorator is used on it's properties.
 *
 * @example
 * \@XmlElem()
 * class EmptyXmlElement {}
 *
 * \@XmlElem({ name: 'some-xml-element' })
 * class SomeXmlElement {
 *   \@XmlChildElem()
 *   child: string;
 * }
 *
 * \@XmlElem({ xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/' })
 * class SomeXmlElement {
 *   \@XmlChildElem()
 *   child: string;
 * }
 */
function XmlElem(opts) {
    return (target) => {
        opts = opts || {};
        opts.name = opts.name || target.name;
        if (!opts.name) {
            throw new Error(`xml-class-transformer: Failed to get the element name for class ${target}. Specify it with @XmlElem({ name: '...' }) decorator.`);
        }
        registry.setEntityOptions(target, opts);
        return target;
    };
}
/**
 * Class property decorator.
 *
 * @example
 * class SomeElement {
 *   \@XmlChildElem({ type: () => String })
 *   stringElem: string;
 *
 *   \@XmlChildElem({ name: 'someOtherName', type: () => Number })
 *   numberElem: string;
 *
 *   \@XmlChildElem({ type: () => NestedElem })
 *   nestedElem: NestedElem;
 * }
 */
function XmlChildElem(opts) {
    return propertyDecoratorFactory('XmlChildElem', opts);
}
/**
 * Class property decorator.
 * For more details on options see {@link XmlAttributeOptions}
 *
 * @example
 * // a basic example
 * class SomeXmlElement {
 *   \@XmlAttribute({ name: 'attributeName', type: () => String })
 *   attributeName: string;
 * }
 */
function XmlAttribute(opts) {
    return propertyDecoratorFactory('XmlAttribute', Object.assign(Object.assign({}, opts), { attr: true }));
}
/**
 * This decorator, when used on a class property, collects all the comments
 * from the provided XML, turns them into an array of strings and puts them into
 * that property. And vice-versa: at serialization that array of strings gets serialized to set of comments
 * in the resulting XML.
 *
 * @example
 * ```ts
 * class SomeElement {
 *   \@XmlComments()
 *   comments?: string[];
 * }
 *
 * classToXml(
 *   new SomeElement({
 *     comments: ['some comment', 'some other comment']
 *   })
 * )
 * ```
 *
 * Output:
 * ```xml
 * <SomeElement>
 *   <!-- some comment -->
 *   <!-- some other comment -->
 * </SomeElement>
 *
 * ```
 */
function XmlComments() {
    return (target, propertyKey) => {
        if (typeof propertyKey !== 'string') {
            // Dont support symbols for now
            throw new TypeError(`xml-class-transformer: Can't use @XmlComments({...}) decorator on a symbol property ` +
                `at ${target.constructor.name}#${propertyKey.toString()}`);
        }
        registry.setPropertyOptions(target.constructor, propertyKey, {
            comments: true,
        });
    };
}
/**
 * The property will be parsed and serialized as a character data.
 * The "type" parameter can only be a primitive type: String, Number, Boolean.
 *
 * ```ts
 * \@XmlElem({ name: 'Comment' })
 * class Comment {
 *   \@XmlChardata({ type: () => String })
 *   text: string;
 *
 *   \@XmlAttribute({ type: () => String, name: 'lang' })
 *   language: string;
 *
 *   constructor(d?: Comment) {
 *     Object.assign(this, d || {});
 *   }
 * }
 *
 * classToXml(
 *   new Comment({
 *     text: 'This is awesome',
 *     language: 'en',
 *   }),
 * )
 * ```
 *
 * Output:
 * ```xml
 * <Comment lang="en">This is awesome</Comment>
 * ```
 */
function XmlChardata(opts) {
    return propertyDecoratorFactory('XmlChardata', Object.assign(Object.assign({}, opts), { chardata: true }));
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
        if (opts.union && !opts.union().length) {
            throw new TypeError(`xml-class-transformer: The "union" option in @${decoratorName}({ ... }) can't be empty ` +
                `at ${target.constructor.name}#${propertyKey.toString()}. Either remove the "union" option or provide it with at least one type.`);
        }
        if (opts.union) {
            if (opts.name) {
                throw new TypeError(`xml-class-transformer: The "union" option is not compatible with the "name" option at ` +
                    `${target.constructor.name}#${propertyKey.toString()}. ` +
                    `XML element names for the union members should be specified at ` +
                    `the union member classes.`);
            }
        }
        else {
            opts.name = opts.name || propertyKey;
        }
        if (opts.union) {
            // opts.union() at the moment of running this peace of code can potentially return
            // undefineds as the value of some elements in case if there are circular dependencies.
            // But the primitive values constructors (String, Number and Boolean) are always defined.
            // So it's okay to check them like this:
            const unionArr = opts.union();
            const foundPrimitiveType = unionArr.find((type) => isPrimitiveType(type));
            if (foundPrimitiveType) {
                throw new TypeError(`xml-class-transformer: unions of primitive types (String, Number or Boolean) are not supported. ` +
                    `Fix it in the decorator @${decoratorName}({ ` +
                    `union: ${serializeUnionForLog(unionArr)}, ... }) ` +
                    `at "${target.constructor.name}#${propertyKey.toString()}".`);
            }
        }
        registry.setPropertyOptions(target.constructor, propertyKey, opts);
    };
}

exports.XmlAttribute = XmlAttribute;
exports.XmlChardata = XmlChardata;
exports.XmlChildElem = XmlChildElem;
exports.XmlComments = XmlComments;
exports.XmlElem = XmlElem;
exports.classToXml = classToXml;
exports.xmlToClass = xmlToClass;
//# sourceMappingURL=index.cjs.map
