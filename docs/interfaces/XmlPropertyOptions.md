[xml-class-transformer](../README.md) / XmlPropertyOptions

# Interface: XmlPropertyOptions

## Table of contents

### Properties

- [array](XmlPropertyOptions.md#array)
- [attr](XmlPropertyOptions.md#attr)
- [chardata](XmlPropertyOptions.md#chardata)
- [name](XmlPropertyOptions.md#name)
- [type](XmlPropertyOptions.md#type)

## Properties

### array

• `Optional` **array**: `boolean`

If true, the property will be parsed and serialized as an array.
Not compatible with `attr` and `chardata` options.

#### Defined in

[src/index.ts:38](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L38)

___

### attr

• `Optional` **attr**: `boolean`

If true, the property will be parsed and serialized as an attribute.

#### Defined in

[src/index.ts:52](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L52)

___

### chardata

• `Optional` **chardata**: `boolean`

If true, the property will be parsed and serialized as a character data.
Not compatible with `array` and `attr` options.

It's only useful when you parse elements with a text node and no attributes.

**`Example`**

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
 })
)

// Output:
<Comment lang="en">This is awesome</Comment>
```

#### Defined in

[src/index.ts:84](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L84)

___

### name

• `Optional` **name**: `string`

XML element name.
If not specified, the property name will be used.
It is highly recommended to specify it explicitly.

Not compatible with `chardata` options.

#### Defined in

[src/index.ts:47](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L47)

___

### type

• **type**: [`XmlType`](../README.md#xmltype) \| [`XmlType`](../README.md#xmltype)[]

Specify primitive type or class type for parsing and serializing.

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

[src/index.ts:32](https://github.com/Edgar-P-yan/xml-class-transformer/blob/aa8e075/src/index.ts#L32)
