xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [XmlEntityOptions](interfaces/XmlEntityOptions.md)
- [XmlPropertyOptions](interfaces/XmlPropertyOptions.md)

### Type Aliases

- [AnyClass](README.md#anyclass)
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

[index.ts:3](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L3)

___

### XmlType

Ƭ **XmlType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| [`AnyClass`](README.md#anyclass)

#### Defined in

[index.ts:5](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L5)

## Functions

### XmlEntity

▸ **XmlEntity**(`opts?`): `ClassDecorator`

Class decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`XmlEntityOptions`](interfaces/XmlEntityOptions.md) |

#### Returns

`ClassDecorator`

#### Defined in

[index.ts:96](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L96)

___

### XmlProperty

▸ **XmlProperty**(`opts`): `PropertyDecorator`

Class property decorator

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlPropertyOptions`](interfaces/XmlPropertyOptions.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[index.ts:126](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L126)

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

[index.ts:281](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L281)

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

[index.ts:150](https://github.com/Edgar-P-yan/xml-class-transformer/blob/14820b5/src/index.ts#L150)
