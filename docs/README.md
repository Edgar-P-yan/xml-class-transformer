xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [ClassToXmlOptions](interfaces/ClassToXmlOptions.md)
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

[src/types.ts:3](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/types.ts#L3)

___

### XmlType

Ƭ **XmlType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| [`AnyClass`](README.md#anyclass)

#### Defined in

[src/types.ts:5](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/types.ts#L5)

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

[src/decorators.ts:7](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/decorators.ts#L7)

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

[src/decorators.ts:28](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/decorators.ts#L28)

___

### classToXml

▸ **classToXml**(`entity`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `any` |
| `options?` | [`ClassToXmlOptions`](interfaces/ClassToXmlOptions.md) |

#### Returns

`string`

#### Defined in

[src/xml-class-transformer.ts:136](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/xml-class-transformer.ts#L136)

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

[src/xml-class-transformer.ts:5](https://github.com/Edgar-P-yan/xml-class-transformer/blob/1d938d0/src/xml-class-transformer.ts#L5)
