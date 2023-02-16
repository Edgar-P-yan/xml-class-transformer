xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [XmlPropertyOpts](interfaces/XmlPropertyOpts.md)

### Type Aliases

- [AnyClass](README.md#anyclass)
- [XmlEntityOpts](README.md#xmlentityopts)
- [XmlType](README.md#xmltype)

### Functions

- [XmlEntity](README.md#xmlentity)
- [XmlProperty](README.md#xmlproperty)
- [classToXml](README.md#classtoxml)
- [xmlToClass](README.md#xmltoclass)

## Type Aliases

### AnyClass

Ƭ **AnyClass**: () => `any`

#### Type declaration

• **new AnyClass**(): `any`

##### Returns

`any`

#### Defined in

[index.ts:3](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L3)

___

### XmlEntityOpts

Ƭ **XmlEntityOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name?` | `string` |
| `xmlns?` | `string` |

#### Defined in

[index.ts:7](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L7)

___

### XmlType

Ƭ **XmlType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| [`AnyClass`](README.md#anyclass)

#### Defined in

[index.ts:5](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L5)

## Functions

### XmlEntity

▸ **XmlEntity**(`opts`): `ClassDecorator`

Class decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlEntityOpts`](README.md#xmlentityopts) |

#### Returns

`ClassDecorator`

#### Defined in

[index.ts:36](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L36)

___

### XmlProperty

▸ **XmlProperty**(`opts`): `PropertyDecorator`

Class property decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlPropertyOpts`](interfaces/XmlPropertyOpts.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[index.ts:58](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L58)

___

### classToXml

▸ **classToXml**(`entity`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `any` |
| `options?` | `JS2XML` |

#### Returns

`string`

#### Defined in

[index.ts:211](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L211)

___

### xmlToClass

▸ **xmlToClass**<`T`\>(`xml`, `_class`): `InstanceType`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AnyClass`](README.md#anyclass) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |
| `_class` | `T` |

#### Returns

`InstanceType`<`T`\>

#### Defined in

[index.ts:80](https://github.com/VitorLuizC/typescript-library-boilerplate/blob/b44a20e/src/index.ts#L80)
