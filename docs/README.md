xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [ClassToXmlOptions](interfaces/ClassToXmlOptions.md)
- [XmlAttributeOptions](interfaces/XmlAttributeOptions.md)
- [XmlChardataOptions](interfaces/XmlChardataOptions.md)
- [XmlChildElemOptions](interfaces/XmlChildElemOptions.md)
- [XmlElemOptions](interfaces/XmlElemOptions.md)

### Type Aliases

- [XmlClass](README.md#xmlclass)
- [XmlPrimitiveType](README.md#xmlprimitivetype)
- [XmlType](README.md#xmltype)

### Functions

- [XmlAttribute](README.md#xmlattribute)
- [XmlChardata](README.md#xmlchardata)
- [XmlChildElem](README.md#xmlchildelem)
- [XmlComments](README.md#xmlcomments)
- [XmlElem](README.md#xmlelem)
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

[src/types.ts:22](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/types.ts#L22)

___

### XmlPrimitiveType

Ƭ **XmlPrimitiveType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| typeof `BigInt`

#### Defined in

[src/types.ts:26](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/types.ts#L26)

___

### XmlType

Ƭ **XmlType**: [`XmlPrimitiveType`](README.md#xmlprimitivetype) \| [`XmlClass`](README.md#xmlclass)

#### Defined in

[src/types.ts:32](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/types.ts#L32)

## Functions

### XmlAttribute

▸ **XmlAttribute**(`opts`): `PropertyDecorator`

Class property decorator.
For more details on options see [XmlAttributeOptions](interfaces/XmlAttributeOptions.md)

**`Example`**

```ts
// a basic example
class SomeXmlElement {
  @XmlAttribute({ name: 'attributeName', type: () => String })
  attributeName: string;
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlAttributeOptions`](interfaces/XmlAttributeOptions.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:79](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/decorators.ts#L79)

___

### XmlChardata

▸ **XmlChardata**(`opts`): `PropertyDecorator`

The property will be parsed and serialized as a character data.
The "type" parameter can only be a primitive type: String, Number, Boolean.

```ts
\@XmlElem({ name: 'Comment' })
class Comment {
  \@XmlChardata({ type: () => String })
  text: string;

  \@XmlAttribute({ type: () => String, name: 'lang' })
  language: string;

  constructor(d?: Comment) {
    Object.assign(this, d || {});
  }
}

classToXml(
  new Comment({
    text: 'This is awesome',
    language: 'en',
  }),
)
```

Output:
```xml
<Comment lang="en">This is awesome</Comment>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlChardataOptions`](interfaces/XmlChardataOptions.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:162](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/decorators.ts#L162)

___

### XmlChildElem

▸ **XmlChildElem**(`opts`): `PropertyDecorator`

Class property decorator.

**`Example`**

```ts
class SomeElement {
  @XmlChildElem({ type: () => String })
  stringElem: string;

  @XmlChildElem({ name: 'someOtherName', type: () => Number })
  numberElem: string;

  @XmlChildElem({ type: () => NestedElem })
  nestedElem: NestedElem;
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`XmlChildElemOptions`](interfaces/XmlChildElemOptions.md) |

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:64](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/decorators.ts#L64)

___

### XmlComments

▸ **XmlComments**(): `PropertyDecorator`

This decorator, when used on a class property, collects all the comments
from the provided XML, turns them into an array of strings and puts them into
that property. And vice-versa: at serialization that array of strings gets serialized to set of comments
in the resulting XML.

**`Example`**

```ts
class SomeElement {
  \@XmlComments()
  comments?: string[];
}

classToXml(
  new SomeElement({
    comments: ['some comment', 'some other comment']
  })
)
```

Output:
```xml
<SomeElement>
  <!-- some comment -->
  <!-- some other comment -->
</SomeElement>

```

#### Returns

`PropertyDecorator`

#### Defined in

[src/decorators.ts:115](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/decorators.ts#L115)

___

### XmlElem

▸ **XmlElem**(`opts?`): `ClassDecorator`

A class decorator.
It can be omitted, but only if at least one Xml* property decorator is used on it's properties.

**`Example`**

```ts
@XmlElem()
class EmptyXmlElement {}

@XmlElem({ name: 'some-xml-element' })
class SomeXmlElement {
  @XmlChildElem()
  child: string;
}

@XmlElem({ xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/' })
class SomeXmlElement {
  @XmlChildElem()
  child: string;
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`XmlElemOptions`](interfaces/XmlElemOptions.md) |

#### Returns

`ClassDecorator`

#### Defined in

[src/decorators.ts:31](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/decorators.ts#L31)

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

[src/transform-class-to-xml.ts:6](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/transform-class-to-xml.ts#L6)

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

[src/transform-xml-to-class.ts:6](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/transform-xml-to-class.ts#L6)
