xml-class-transformer

# xml-class-transformer

## Table of contents

### Interfaces

- [ClassToXmlOptions](interfaces/ClassToXmlOptions.md)
- [Marshaller](interfaces/Marshaller.md)
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

Only here for the sake of the documentation and type checking.
No need to "implement" this interface.

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

[src/types.ts:26](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L26)

___

### XmlPrimitiveType

Ƭ **XmlPrimitiveType**: typeof `String` \| typeof `Number` \| typeof `Boolean` \| typeof `BigInt` \| typeof `Date`

These types are considered as primitive,
which means that there are built-in marshallers for them,
and you can simply do `{ type: () => String }`.

#### Defined in

[src/types.ts:35](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L35)

___

### XmlType

Ƭ **XmlType**: [`XmlPrimitiveType`](README.md#xmlprimitivetype) \| [`XmlClass`](README.md#xmlclass)

#### Defined in

[src/types.ts:42](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L42)

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

[src/decorators.ts:84](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/decorators.ts#L84)

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

[src/decorators.ts:174](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/decorators.ts#L174)

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

[src/decorators.ts:66](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/decorators.ts#L66)

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

[src/decorators.ts:123](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/decorators.ts#L123)

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

[src/decorators.ts:35](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/decorators.ts#L35)

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

[src/transform-class-to-xml.ts:12](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/transform-class-to-xml.ts#L12)

___

### xmlToClass

▸ **xmlToClass**<`T`\>(`xml`, `classConstructor`, `options?`): `InstanceType`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`XmlClass`](README.md#xmlclass) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |
| `classConstructor` | `T` |
| `options?` | `XML2JS` |

#### Returns

`InstanceType`<`T`\>

#### Defined in

[src/transform-xml-to-class.ts:8](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/transform-xml-to-class.ts#L8)
