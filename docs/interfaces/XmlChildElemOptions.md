[xml-class-transformer](../README.md) / XmlChildElemOptions

# Interface: XmlChildElemOptions

## Table of contents

### Properties

- [array](XmlChildElemOptions.md#array)
- [name](XmlChildElemOptions.md#name)
- [type](XmlChildElemOptions.md#type)
- [union](XmlChildElemOptions.md#union)

## Properties

### array

• `Optional` **array**: `boolean`

If true, the property will be parsed and serialized as an array.
Not compatible with the `attr` and `chardata` options.

#### Defined in

[src/types.ts:85](https://github.com/Edgar-P-yan/xml-class-transformer/blob/7aaf245/src/types.ts#L85)

___

### name

• `Optional` **name**: `string`

A custom XML element name.
If not specified, the property name will be used.
It is recommended to specify it explicitly for expressiveness.

Not compatible with the `chardata` option, bacause chardata is not an element.
Not compatible with the `union` option, because union typed elements name is gathered from the union's members names.

#### Defined in

[src/types.ts:95](https://github.com/Edgar-P-yan/xml-class-transformer/blob/7aaf245/src/types.ts#L95)

___

### type

• `Optional` **type**: () => [`XmlType`](../README.md#xmltype)

#### Type declaration

▸ (): [`XmlType`](../README.md#xmltype)

Specify primitive type or class type for parsing and serializing.

**`Example`**

{ type: () => Number }
{ type: () => Boolean }
{ type: () => BigInt }
{ type: () => CustomClass }

Not compatible with the `union` option.

##### Returns

[`XmlType`](../README.md#xmltype)

#### Defined in

[src/types.ts:64](https://github.com/Edgar-P-yan/xml-class-transformer/blob/7aaf245/src/types.ts#L64)

___

### union

• `Optional` **union**: () => [`XmlClass`](../README.md#xmlclass)[]

#### Type declaration

▸ (): [`XmlClass`](../README.md#xmlclass)[]

You can also specify union types, then at the parsing time
the one whose name matches the XML element name will be selected.
The serialization of union types is performed in the same manner:
the name of the class is used as the XML element name.

Union types are not compatible with the `type` and `name` options.

Primitive types are not supported in unions.

**`Example`**

```ts
{ union: () => [User, Admin] }
```

##### Returns

[`XmlClass`](../README.md#xmlclass)[]

#### Defined in

[src/types.ts:79](https://github.com/Edgar-P-yan/xml-class-transformer/blob/7aaf245/src/types.ts#L79)
