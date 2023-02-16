[xml-class-transformer](../README.md) / XmlPropertyOpts

# Interface: XmlPropertyOpts

## Table of contents

### Properties

- [array](XmlPropertyOpts.md#array)
- [attr](XmlPropertyOpts.md#attr)
- [chardata](XmlPropertyOpts.md#chardata)
- [name](XmlPropertyOpts.md#name)
- [type](XmlPropertyOpts.md#type)

## Properties

### array

• `Optional` **array**: `boolean`

#### Defined in

[index.ts:20](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L20)

___

### attr

• `Optional` **attr**: `boolean`

#### Defined in

[index.ts:22](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L22)

___

### chardata

• `Optional` **chardata**: `boolean`

#### Defined in

[index.ts:23](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L23)

___

### name

• **name**: `undefined` \| `string`

#### Defined in

[index.ts:21](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L21)

___

### type

• **type**: [`XmlType`](../README.md#xmltype) \| [`XmlType`](../README.md#xmltype)[]

Specify primitive type or class type for parsing.

**`Example`**

```ts
{ type: String }

You can also specify multiple classes, then the one whose name matches the element name will be selected.
```

**`Example`**

```ts
{ type: [Version, DeleteMarker] }
```

#### Defined in

[index.ts:19](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L19)
