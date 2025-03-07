/*!
 * xml-class-transformer v3.0.1
 * (c) Edgar Pogosyan
 * Released under the MIT License.
 */

import xmljs from 'xml-js-v2';

class DefaultNumberMarshaller {
    marshal(value) {
        if (value === undefined) {
            return undefined;
        }
        return value === null ? '' : `${value}`;
    }
    unmarshal(chardata) {
        if (chardata === undefined) {
            return undefined;
        }
        const castToStr = `${chardata}`;
        // parse empty strings to nulls when the specified type is Number
        // because there is no convenient way to represent an empty string as a number,
        // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
        // Maybe a better idea would be to convert them to NaN just as parseFloat does.
        return castToStr === ''
            ? null
            : castToStr
                ? parseFloat(castToStr)
                : undefined;
    }
}
class DefaultBigIntMarshaller {
    marshal(value) {
        if (value === undefined) {
            return undefined;
        }
        return value === null ? '' : `${value}`;
    }
    unmarshal(chardata) {
        if (chardata === undefined) {
            return undefined;
        }
        const castToStr = `${chardata}`;
        // parse empty strings to nulls when the specified type is BigInt
        // because there is no convenient way to represent an empty string as a number,
        // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
        // Maybe a better idea would be to convert them to NaN just as parseFloat does.
        return castToStr === '' ? null : castToStr ? BigInt(castToStr) : undefined;
    }
}
class DefaultStringMarshaller {
    marshal(value) {
        if (value === undefined) {
            return undefined;
        }
        return value === null ? '' : `${value}`;
    }
    unmarshal(chardata) {
        if (chardata === undefined) {
            return undefined;
        }
        return `${chardata}`;
    }
}
class DefaultBooleanMarshaller {
    marshal(value) {
        if (value === undefined) {
            return undefined;
        }
        return value === null ? '' : `${value}`;
    }
    unmarshal(chardata) {
        if (chardata === undefined) {
            return undefined;
        }
        const castToStr = `${chardata}`;
        return castToStr === ''
            ? null
            : castToStr
                ? castToStr === 'true'
                : undefined;
    }
}
class DefaultDateMarshaller {
    marshal(value) {
        if (value === undefined) {
            return undefined;
        }
        return value === null ? '' : value.toISOString();
    }
    unmarshal(chardata) {
        if (chardata === undefined) {
            return undefined;
        }
        return chardata === '' ? null : new Date(chardata);
    }
}
const defaultNumberMarshaller = new DefaultNumberMarshaller();
const defaultBigIntMarshaller = new DefaultBigIntMarshaller();
const defaultStringMarshaller = new DefaultStringMarshaller();
const defaultBooleanMarshaller = new DefaultBooleanMarshaller();
const defaultDateMarshaller = new DefaultDateMarshaller();

function errUnknownClass(classConstructor) {
    return new Error(`xml-class-transformer: class "${classConstructor}" not found. Make sure there is a @XmlElem({...}) ` +
        `decorator on it, or XmlChildElem, XmlAttribute, XmlChardata or XmlComments decorator on its properties.`);
}
function errNoXmlNameForClass(xmlClass) {
    return new Error(`xml-class-transformer: no XML name is specified for ${xmlClass === null || xmlClass === void 0 ? void 0 : xmlClass.name}. ` +
        `Specify it with the @XmlElem({ name: '...' }) decorator.`);
}
function serializeUnionForLog(union) {
    return '[' + union.map((t) => { var _a; return (_a = t === null || t === void 0 ? void 0 : t.name) !== null && _a !== void 0 ? _a : `${union}`; }).join(', ') + ']';
}
function isPrimitiveType(type) {
    return (type === String ||
        type === Number ||
        type === BigInt ||
        type === Boolean ||
        type === Date);
}
function getDefaultMarshaller(type) {
    switch (type) {
        case String:
            return defaultStringMarshaller;
        case Number:
            return defaultNumberMarshaller;
        case BigInt:
            return defaultBigIntMarshaller;
        case Boolean:
            return defaultBooleanMarshaller;
        case Date:
            return defaultDateMarshaller;
    }
    throw new Error('unknown primitive type ' + type);
}

class ClassMetadataRegistry {
    constructor() {
        this.registry = new Map();
    }
    setEntityOptions(classConstructor, opts) {
        const metadata = this.registry.get(classConstructor);
        if (metadata) {
            metadata.entity = opts;
        }
        else {
            this.registry.set(classConstructor, {
                entity: opts,
                properties: new Map(),
            });
        }
    }
    setPropertyOptions(classConstr, propertyKey, opts) {
        const metadata = this.getOrCreate(classConstr);
        if (opts.comments) {
            for (const [searchingPropKey, searchingOpts] of metadata.properties) {
                if (searchingOpts.comments) {
                    throw new Error(`xml-class-transformer: only one @XmlComment() decorator is allowed per class. ` +
                        `Can not define @XmlComment() decorator for  ` +
                        `${classConstr.name}#${propertyKey} since it's already used for ` +
                        `${classConstr.name}#${searchingPropKey}.`);
                }
            }
        }
        if (opts.name) {
            for (const [searchingPropKey, searchingOpts] of metadata.properties) {
                if (searchingOpts.name === opts.name) {
                    throw new Error(`xml-class-transformer: can't use XML element name defined in ` +
                        `{ name: ${JSON.stringify(opts.name)} } for ` +
                        `${classConstr.name}#${propertyKey} since it's already used for ` +
                        `${classConstr.name}#${searchingPropKey}. Change it to something else.`);
                }
                // TODO: maybe support multiple chardata for multiple child text nodes inside an xml element.
                // each of those chardata properties whould match the text node at the same position as the property itself.
                // The same goes for not yet implemented comments and cdata.
                if (opts.chardata && searchingOpts.chardata) {
                    throw new Error(`xml-class-transformer: an XML element can have only one chardata property. ` +
                        `Both ${classConstr.name}#${propertyKey} and ${classConstr.name}#${searchingOpts.name} ` +
                        `are defined as chardata, which is not valid.`);
                }
            }
        }
        metadata.properties.set(propertyKey, opts);
    }
    getOrCreate(classConstr) {
        const existing = this.registry.get(classConstr);
        if (existing) {
            return existing;
        }
        else {
            const newMetadatas = {
                entity: {
                    name: classConstr === null || classConstr === void 0 ? void 0 : classConstr.name,
                },
                properties: new Map(),
            };
            this.registry.set(classConstr, newMetadatas);
            return newMetadatas;
        }
    }
    get(classConstr) {
        return this.registry.get(classConstr);
    }
    resolveUnionComponents(union) {
        // TODO: optimize and cache this map:
        const tagNameToClassType = new Map();
        for (const classType of union) {
            const classTypeMetadata = registry.get(classType);
            if (!classTypeMetadata) {
                throw errUnknownClass(classType);
            }
            const tagName = classTypeMetadata.entity.name;
            if (!tagName) {
                throw errNoXmlNameForClass(classType);
            }
            tagNameToClassType.set(tagName, classType);
        }
        return tagNameToClassType;
    }
}
const registry = new ClassMetadataRegistry();

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
    if (isPrimitiveType(entityConstructor)) {
        return primitiveTypeToXml(entity, name, entityConstructor);
    }
    const metadatas = registry.get(entityConstructor);
    if (!metadatas) {
        throw errUnknownClass(entityConstructor);
    }
    const elemName = name || metadatas.entity.name;
    if (!elemName) {
        throw errNoXmlNameForClass(entityConstructor);
    }
    const mutChildren = [];
    const mutAttributes = {};
    for (const [classKey, opts] of metadatas.properties) {
        marshalProperty(entityConstructor, entity, opts, classKey, mutChildren, mutAttributes);
    }
    if (metadatas.entity.xmlns) {
        mutAttributes['xmlns'] = metadatas.entity.xmlns;
    }
    return {
        type: 'element',
        name: elemName,
        attributes: mutAttributes,
        elements: mutChildren,
    };
}
function primitiveTypeToXml(value, name, entityConstructor) {
    const defaultMarshaller = getDefaultMarshaller(entityConstructor);
    const text = defaultMarshaller.marshal(value);
    if (text === undefined) {
        // should never happen, but just in case
        return {};
    }
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
function marshalProperty(containerEntityConstructor, entity, opts, classKey, mutChildren, mutAttributes) {
    if (opts.comments) {
        marshalCommentsProperty(entity, classKey, mutChildren);
    }
    else if (opts.attr) {
        marshalAttributeProperty(containerEntityConstructor, entity, opts, classKey, mutAttributes);
    }
    else if (opts.chardata) {
        marshalChardataProperty(entity, opts, classKey, mutChildren);
    }
    else if (opts.array) {
        marshalArrayProperty(entity, opts, classKey, mutChildren);
    }
    else if (opts.marshaller || opts.isPrimitiveType()) {
        marshalPrimitiveTypeProperty(containerEntityConstructor, entity, opts, classKey, mutChildren);
    }
    else if (opts.union) {
        marshalUnionProperty(entity, classKey, mutChildren);
    }
    else {
        marshalChildClassElemProperty(entity, opts, classKey, mutChildren);
    }
}
function marshalCommentsProperty(entity, classKey, mutChildren) {
    if (Array.isArray(entity[classKey])) {
        for (const comment of entity[classKey]) {
            mutChildren.push({
                type: 'comment',
                comment: comment === null || comment === undefined ? '' : `${comment}`,
            });
        }
    }
}
function marshalAttributeProperty(containerEntityConstructor, entity, opts, classKey, mutAttributes) {
    if (!opts.name) {
        throw new Error(`xml-class-transformer: no name is specified for the property ${containerEntityConstructor === null || containerEntityConstructor === void 0 ? void 0 : containerEntityConstructor.name}#${classKey}. ` +
            `Specify it with the @XmlAttribute({ name: '...' }) decorator.`);
    }
    const value = marshal(entity[classKey], opts);
    if (value === undefined) {
        return;
    }
    mutAttributes[opts.name] = `${value}`;
}
function marshalChardataProperty(entity, opts, classKey, mutChildren) {
    const value = marshal(entity[classKey], opts);
    if (value === undefined) {
        return;
    }
    mutChildren.push({
        type: 'text',
        text: value,
    });
}
function marshalArrayProperty(entity, opts, classKey, mutChildren) {
    if (entity[classKey] === null || entity[classKey] === undefined) {
        return;
    }
    for (const entityFromArray of entity[classKey]) {
        if (opts.marshaller || opts.isPrimitiveType()) {
            const marshalledValue = marshal(entityFromArray, opts);
            if (marshalledValue === undefined) {
                continue;
            }
            mutChildren.push(primitiveTypeToXml(entityFromArray, opts.name, String));
        }
        else {
            // Do not process null and undefined values in the array.
            // When we impl support for primitive unions maybe this should change
            if (entityFromArray === null || entityFromArray === undefined) {
                continue;
            }
            // If it is a union then we can't guess required class out of it.
            // In those cases users should give to the library actual class instances (aka new MyEntity({...}))
            // so the library can guess the class type just by looking at the myEntity.constructor
            const classConstructor = opts.union
                ? entityFromArray.constructor
                : opts.type();
            // The opts.name will be undefined if !!opts.union, but thats ok.
            mutChildren.push(classToXmlInternal(entityFromArray, opts.name, classConstructor));
        }
    }
}
function marshalPrimitiveTypeProperty(containerEntityConstructor, entity, opts, classKey, mutChildren) {
    if (!opts.name) {
        throw new Error(`xml-class-transformer: no name is specified for property ${containerEntityConstructor === null || containerEntityConstructor === void 0 ? void 0 : containerEntityConstructor.name}#${classKey}. ` +
            `Specify it with @XmlChildElem({ name: '...' }) decorator.`);
    }
    const value = marshal(entity[classKey], opts);
    if (value === undefined) {
        return;
    }
    mutChildren.push(primitiveTypeToXml(value, opts.name, String));
}
function marshalUnionProperty(entity, classKey, mutChildren) {
    // should work with primitive types also
    const classConstructor = entity[classKey].constructor;
    mutChildren.push(classToXmlInternal(entity[classKey], undefined, classConstructor));
}
function marshalChildClassElemProperty(entity, opts, classKey, mutChildren) {
    // If null then just skip this embedded element for the current impl
    // TODO: maybe non array unions are broken
    if (entity[classKey] !== undefined && entity[classKey] !== null) {
        mutChildren.push(classToXmlInternal(entity[classKey], opts.name, opts.type()));
    }
}
function marshal(value, opts) {
    let marshalled = value;
    if (opts.marshaller) {
        marshalled = opts.marshaller.marshal(value);
    }
    else if (opts.type) {
        const type = opts.type();
        if (isPrimitiveType(type)) {
            marshalled = getDefaultMarshaller(type).marshal(value);
        }
    }
    return marshalled;
}

function xmlToClass(xml, classConstructor, options) {
    var _a;
    const parsed = xmljs.xml2js(xml, Object.assign(Object.assign({}, options), { compact: false, alwaysArray: true }));
    const firstElement = (_a = parsed.elements) === null || _a === void 0 ? void 0 : _a[0];
    if (!firstElement) {
        throw new Error('xml-class-transformer: No elements found in the xml, make sure its valid.');
    }
    return xmlToClassInternal(firstElement, classConstructor);
}
function xmlToClassInternal(xmlElement, classConstructor) {
    if (isPrimitiveType(classConstructor)) {
        const text = getChardataFromElem(xmlElement);
        return unmarshalPrimitiveType(text, classConstructor);
    }
    const metadatas = registry.get(classConstructor);
    if (!metadatas) {
        throw errUnknownClass(classConstructor);
    }
    const classInstance = new classConstructor();
    for (const [classKey, opts] of metadatas.properties) {
        unmarshalProperty(xmlElement, opts, classKey, classInstance);
    }
    return classInstance;
}
function unmarshalProperty(xmlElement, opts, classKey, mutClassInstance) {
    if (opts.comments) {
        unmarshalCommentsProperty(xmlElement, classKey, mutClassInstance);
    }
    else if (opts.attr) {
        unmarshalAttributeProperty(xmlElement, classKey, opts, mutClassInstance);
    }
    else if (opts.chardata) {
        unmarshalChardataProperty(xmlElement, classKey, opts, mutClassInstance);
    }
    else if (opts.array) {
        unmarshalArrayProperty(xmlElement, classKey, opts, mutClassInstance);
    }
    else if (opts.union) {
        unmarshalUnionProperty(xmlElement, classKey, opts, mutClassInstance);
    }
    else {
        unmarshalPrimitiveOrChildClassElemProperty(xmlElement, classKey, opts, mutClassInstance);
    }
}
function unmarshalCommentsProperty(xmlElement, classKey, mutClassInstance) {
    const commentsAccumulated = [];
    for (const childElem of xmlElement.elements || []) {
        if (childElem.type === 'comment') {
            commentsAccumulated.push(childElem.comment || '');
        }
    }
    mutClassInstance[classKey] = commentsAccumulated;
}
function unmarshalAttributeProperty(xmlElement, classKey, opts, mutClassInstance) {
    var _a;
    if (!opts.name) {
        throw new Error(`xml-class-transformer: no name is specified for attribute ${classKey}. ` +
            `Specify it with @XmlAttribute({ name: '...' }) decorator.`);
    }
    let attrValue = (_a = xmlElement.attributes) === null || _a === void 0 ? void 0 : _a[opts.name];
    if (typeof attrValue === 'number') {
        attrValue = `${attrValue}`;
    }
    const unmarshalled = unmarshal(attrValue, opts);
    mutClassInstance[classKey] = unmarshalled;
}
function unmarshalChardataProperty(xmlElement, classKey, opts, mutClassInstance) {
    const chardata = getChardataFromElem(xmlElement);
    const unmarshalled = unmarshal(chardata, opts);
    mutClassInstance[classKey] = unmarshalled;
}
function unmarshalArrayProperty(xmlElement, classKey, opts, mutClassInstance) {
    var _a;
    if (opts.union) {
        const mapTagToClassConstr = registry.resolveUnionComponents(opts.union());
        const unmarshalledValues = [];
        for (const el of xmlElement.elements || []) {
            if (el.name && mapTagToClassConstr.has(el.name)) {
                const classConstr = mapTagToClassConstr.get(el.name);
                const entity = xmlToClassInternal(el, classConstr);
                unmarshalledValues.push(entity);
            }
        }
        mutClassInstance[classKey] = unmarshalledValues;
    }
    else {
        const elems = ((_a = xmlElement.elements) === null || _a === void 0 ? void 0 : _a.filter((e) => e.name === opts.name)) || [];
        const unmarshalledValues = [];
        for (const el of elems) {
            const entity = xmlToClassInternal(el, opts.type());
            unmarshalledValues.push(entity);
        }
        mutClassInstance[classKey] = unmarshalledValues;
    }
}
function unmarshalUnionProperty(xmlElement, classKey, opts, mutClassInstance) {
    var _a;
    const mapTagToClassConstr = registry.resolveUnionComponents(opts.union());
    const matchingXmlElement = (_a = xmlElement.elements) === null || _a === void 0 ? void 0 : _a.find((el) => {
        return el.name ? mapTagToClassConstr.has(el.name) : false;
    });
    mutClassInstance[classKey] = matchingXmlElement
        ? xmlToClassInternal(matchingXmlElement, mapTagToClassConstr.get(matchingXmlElement.name))
        : undefined;
}
function unmarshalPrimitiveOrChildClassElemProperty(xmlElement, classKey, opts, mutClassInstance) {
    var _a;
    // is primitive type, marshaller or child class elem
    const el = (_a = xmlElement.elements) === null || _a === void 0 ? void 0 : _a.find((el) => el.name === opts.name);
    if (opts.marshaller || opts.isPrimitiveType()) {
        const chardata = el ? getChardataFromElem(el) : undefined;
        const unmarshalled = unmarshal(chardata, opts);
        mutClassInstance[classKey] = unmarshalled;
    }
    else if (el) {
        mutClassInstance[classKey] = xmlToClassInternal(el, opts.type());
    }
    else {
        mutClassInstance[classKey] = undefined;
    }
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
function unmarshal(
// Support numbers also
value, opts) {
    let unmarshalled = value;
    if (opts.marshaller) {
        unmarshalled = opts.marshaller.unmarshal(value);
    }
    else if (opts.type) {
        const type = opts.type();
        if (isPrimitiveType(type)) {
            unmarshalled = getDefaultMarshaller(type).unmarshal(value);
        }
    }
    return unmarshalled;
}
function unmarshalPrimitiveType(
// Support numbers also
value, classConstructor) {
    const defaultMarshaller = classConstructor
        ? getDefaultMarshaller(classConstructor)
        : defaultStringMarshaller;
    const strValue = typeof value === 'number' ? `${value}` : value;
    const unmarshalled = defaultMarshaller.unmarshal(strValue);
    return unmarshalled;
}

class Fields {
}
/**
 * Used to accumulate the metadatas from all of the property decorators:
 * `XmlChildElem`, `XmlAttribute`, `XmlChardata`, `XmlComments`
 */
class InternalXmlPropertyOptions extends Fields {
    constructor(init) {
        super();
        Object.assign(this, init);
    }
    isPrimitiveType() {
        return this.type ? isPrimitiveType(this.type()) : false;
    }
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
            throw errNoXmlNameForClass(target);
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
    return propertyDecoratorFactory('XmlChildElem', new InternalXmlPropertyOptions(opts));
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
    return propertyDecoratorFactory('XmlAttribute', new InternalXmlPropertyOptions(Object.assign(Object.assign({}, opts), { attr: true })));
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
        registry.setPropertyOptions(target.constructor, propertyKey, new InternalXmlPropertyOptions({
            comments: true,
        }));
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
    return propertyDecoratorFactory('XmlChardata', new InternalXmlPropertyOptions(Object.assign(Object.assign({}, opts), { chardata: true })));
}
function propertyDecoratorFactory(decoratorName, opts) {
    return (target, propertyKey) => {
        if (typeof propertyKey !== 'string') {
            // Dont support symbols for now
            throw new TypeError(`xml-class-transformer: Can't use @${decoratorName}({...}) decorator on a symbol property ` +
                `at ${target.constructor.name}#${propertyKey.toString()}`);
        }
        if (!opts.union && !opts.type && !opts.marshaller) {
            throw new TypeError(`xml-class-transformer: No "type", "union" or "marshaller" was specified for the ` +
                `${target.constructor.name}#${propertyKey.toString()}. Add it to ` +
                `the @${decoratorName}({...}) decorator.`);
        }
        if ((opts.union && opts.type) ||
            (opts.union && opts.marshaller) ||
            (opts.type && opts.marshaller)) {
            throw new TypeError(`xml-class-transformer: The "union", "type" or "marshaller" options are not compatible with each other at ` +
                `${target.constructor.name}#${propertyKey.toString()}. ` +
                `You can specify only one of them.`);
        }
        if (opts.union && !opts.union().length) {
            throw new TypeError(`xml-class-transformer: The "union" option in @${decoratorName}({ ... }) can't be empty ` +
                `at ${target.constructor.name}#${propertyKey.toString()}. ` +
                `Either remove the "union" option or provide it with at least one type.`);
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
                throw new TypeError(`xml-class-transformer: unions of primitive types (String, Number, Boolean, BigInt or Date) are not supported. ` +
                    `Fix it in the decorator @${decoratorName}({ ` +
                    `union: ${serializeUnionForLog(unionArr)}, ... }) ` +
                    `at "${target.constructor.name}#${propertyKey.toString()}".`);
            }
        }
        registry.setPropertyOptions(target.constructor, propertyKey, opts);
    };
}

export { XmlAttribute, XmlChardata, XmlChildElem, XmlComments, XmlElem, classToXml, xmlToClass };
