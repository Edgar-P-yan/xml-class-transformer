[xml-class-transformer](../README.md) / XmlElemOptions

# Interface: XmlElemOptions

## Table of contents

### Properties

- [name](XmlElemOptions.md#name)
- [xmlns](XmlElemOptions.md#xmlns)

## Properties

### name

• `Optional` **name**: `string`

XML element name.
If not specified, the class name will be used.

#### Defined in

[src/types.ts:58](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L58)

___

### xmlns

• `Optional` **xmlns**: `string`

The xmlns attribute value. Specifies the default XML namespace.
This is just a shortcut for the `@XmlAttribute({ name: 'xmlns', type: () => String })` property decorator.

**`Example`**

```ts
{ xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/' }
```

#### Defined in

[src/types.ts:52](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L52)
