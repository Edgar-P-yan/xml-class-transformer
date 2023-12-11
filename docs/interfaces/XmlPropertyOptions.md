[xml-class-transformer](../README.md) / XmlPropertyOptions

# Interface: XmlPropertyOptions

## Table of contents

### Properties

- [array](XmlPropertyOptions.md#array)
- [attr](XmlPropertyOptions.md#attr)
- [chardata](XmlPropertyOptions.md#chardata)
- [name](XmlPropertyOptions.md#name)
- [type](XmlPropertyOptions.md#type)
- [union](XmlPropertyOptions.md#union)

## Properties

### array

• `Optional` **array**: `boolean`

If true, the property will be parsed and serialized as an array.
Not compatible with the `attr` and `chardata` options.

#### Defined in

[src/types.ts:57](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L57)

___

### attr

• `Optional` **attr**: `boolean`

If true, the property will be parsed and serialized as an attribute.
Not compatible with the `chardata` and `union` options.

#### Defined in

[src/types.ts:72](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L72)

___

### chardata

• `Optional` **chardata**: `boolean`

If true, the property will be parsed and serialized as a character data.
Not compatible with the `name`, `union`, `array` and `attr` options.

It's only useful when you parse elements with a text node and no attributes.

**`Todo`**

maybe we can make it work with primitive unions?

```ts
*XmlEntity({ name: 'Comment' })
class Comment {
  *XmlProperty({ chardata: true })
  text: string;

  *XmlProperty({ name: 'lang', attr: true })
  lenguage: string;

  constructor(d?: Comment) {
    Object.assign(this, d || {});
  }
}

classToXml(
  new Comment({
    text: 'This is awesome',
    lenguage: 'en',
  }),
)
```

Output:
```xml
<Comment lang="en">This is awesome</Comment>
```

#### Defined in

[src/types.ts:109](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L109)

___

### name

• `Optional` **name**: `string`

XML element name.
If not specified, the property name will be used.
It is recommended to specify it explicitly for expressivenes.

Not compatible with the `chardata` option and the union types.

#### Defined in

[src/types.ts:66](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L66)

___

### type

• `Optional` **type**: [`XmlType`](../README.md#xmltype)

Specify primitive type or class type for parsing and serializing.

**`Example`**

{ type: Number }
{ type: Boolean }
{ type: CustomClass }

Not compatible with the `union` option.

#### Defined in

[src/types.ts:33](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L33)

___

### union

• `Optional` **union**: [`XmlType`](../README.md#xmltype)[]

You can also specify union types, then at the parsing time
the one whose name matches the XML element name will be selected.
The serialization of union types is performed in the same manner:
the name of the class is used as the XML element name.

Union types are not compatible with the `type`, `name` and `attr` options.
It is not compatible with the `attr` option because bacause for now attribute values should
only be primitive values, and parsing strings to unions can't be definitive.

**`Todo`**

test unions of primitive with class types

**`Todo`**

test unions of primitive types

**`Example`**

```ts
{ union: [User, Admin] }
```

#### Defined in

[src/types.ts:51](https://github.com/Edgar-P-yan/xml-class-transformer/blob/9de5edc/src/types.ts#L51)
