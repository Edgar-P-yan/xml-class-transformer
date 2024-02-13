[xml-class-transformer](../README.md) / XmlAttributeOptions

# Interface: XmlAttributeOptions

## Table of contents

### Properties

- [name](XmlAttributeOptions.md#name)
- [type](XmlAttributeOptions.md#type)

## Properties

### name

• `Optional` **name**: `string`

XML attribute name.
If not specified, the property name will be used.

#### Defined in

[src/types.ts:103](https://github.com/Edgar-P-yan/xml-class-transformer/blob/6716db1/src/types.ts#L103)

___

### type

• **type**: () => [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Type declaration

▸ (): [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

XML Attributes can only be of primitive types.
Specify the primitive type for parsing and serializing the attribute.

**`Example`**

```ts
{ type: () => String }
{ type: () => Number }
{ type: () => Boolean }
```

##### Returns

[`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Defined in

[src/types.ts:114](https://github.com/Edgar-P-yan/xml-class-transformer/blob/6716db1/src/types.ts#L114)
