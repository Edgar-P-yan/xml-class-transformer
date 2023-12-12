xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [ClassToXmlOptions](interfaces/ClassToXmlOptions.md)
- [XmlEntityOptions](interfaces/XmlEntityOptions.md)
- [XmlPropertyOptions](interfaces/XmlPropertyOptions.md)

### Type Aliases

- [XmlClass](README.md#xmlclass)
- [XmlType](README.md#xmltype)

### Functions

- [XmlAttribute](README.md#xmlattribute)
- [XmlEntity](README.md#xmlentity)
- [XmlProperty](README.md#xmlproperty)
- [classToXml](README.md#classtoxml)
- [xmlToClass](README.md#xmltoclass)

## Type Aliases

### XmlClass

Ƭ **XmlClass**: () => `any`

#### Type declaration

• **new XmlClass**(): `any`

The XML class's constructor should not require any arguments.
This is because the xml-class-transformer needs to be able to construct them
when it needs to. And if the constructor relies on the arguments then it will crash.

Note that it is okay and even recommended to give your classes a constructor like this:
```ts
class SomeXmlElement {
 ...
  constructor(seed?: SomeXmlElement) {
    Object.assign(this, seed || {})
  }
}
```

note that the `seed` argument is optional. Such a constructor
gives you a way to create instances with passed values and also
enable the library to construct them without passing any arguments.

##### Returns

`any`

#### Defined in

[src/types.ts:22](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/types.ts#L22)

___

### XmlType

Ƭ **XmlType**: `XmlPrimitiveType` \| [`XmlClass`](README.md#xmlclass)

#### Defined in

[src/types.ts:27](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/types.ts#L27)

## Functions

### XmlAttribute

▸ **XmlAttribute**(`opts`): `PropertyDecorator`

Class property decorator.
For more details on options see XmlAttributeOptions

**`Example`**

```ts
// a basic example
class SomeXmlElement {
  *XmlAttribute({ name: 'attributeName', type: () => String })
  attributeName: string;
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `XmlAttributeOptions` |

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:48](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/decorators.ts#L48)

___

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

[src/decorators.ts:12](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/decorators.ts#L12)

___

### XmlProperty

▸ **XmlProperty**(`opts`): `PropertyDecorator`

Class property decorator.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlPropertyOptions`](interfaces/XmlPropertyOptions.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:33](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/decorators.ts#L33)

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

[src/transform-class-to-xml.ts:6](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/transform-class-to-xml.ts#L6)

___

### xmlToClass

▸ **xmlToClass**<`T`\>(`xml`, `_class`): `InstanceType`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`XmlClass`](README.md#xmlclass) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |
| `_class` | `T` |

#### Returns

`InstanceType`<`T`\>

#### Defined in

[src/transform-xml-to-class.ts:6](https://github.com/Edgar-P-yan/xml-class-transformer/blob/0116cb1/src/transform-xml-to-class.ts#L6)
