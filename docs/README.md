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

[src/index.ts:4](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L4)

___

### XmlType

Ƭ **XmlType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| [`AnyClass`](README.md#anyclass)

#### Defined in

[src/index.ts:6](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L6)

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

[src/index.ts:97](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L97)

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

[src/index.ts:127](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L127)

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

[src/index.ts:294](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L294)

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

[src/index.ts:151](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L151)
