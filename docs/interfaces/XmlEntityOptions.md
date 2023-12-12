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

[src/types.ts:40](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/types.ts#L40)

___

### xmlns

• `Optional` **xmlns**: `string`

xmlns attribute value.
This is just a shortcut for the `@XmlAttribute({ name: 'xmlns', type: () => String })` property decorator.

#### Defined in

[src/types.ts:34](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/types.ts#L34)
