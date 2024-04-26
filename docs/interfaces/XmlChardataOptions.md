[xml-class-transformer](../README.md) / XmlChardataOptions

# Interface: XmlChardataOptions

## Table of contents

### Properties

- [type](XmlChardataOptions.md#type)

## Properties

### type

• **type**: () => [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Type declaration

▸ (): [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

An XML chardata an only be of primitive types.
Specify the primitive type for parsing and serializing the chardata.

**`Example`**

```ts
{ type: () => String }
{ type: () => Number }
{ type: () => BigInt }
{ type: () => Boolean }
```

##### Returns

[`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Defined in

[src/types.ts:128](https://github.com/Edgar-P-yan/xml-class-transformer/blob/feffe5e/src/types.ts#L128)
