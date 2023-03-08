[xml-class-transformer](../README.md) / XmlEntityOptions

# Interface: XmlEntityOptions

## Table of contents

### Properties

- [name](XmlEntityOptions.md#name)
- [xmlns](XmlEntityOptions.md#xmlns)

## Properties

### name

• `Optional` **name**: `string`

XML element name.
If not specified, the class name will be used.

#### Defined in

[src/index.ts:19](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0641294/src/index.ts#L19)

___

### xmlns

• `Optional` **xmlns**: `string`

xmlns attribute value.
This is just a shortcut for @XmlAttribute({ name: 'xmlns', value: '...' }) property decorator.

#### Defined in

[src/index.ts:13](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0641294/src/index.ts#L13)
