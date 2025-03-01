[xml-class-transformer](../README.md) / XmlChildElemOptions

# Interface: XmlChildElemOptions

## Table of contents

### Properties

- [array](XmlChildElemOptions.md#array)
- [marshaller](XmlChildElemOptions.md#marshaller)
- [name](XmlChildElemOptions.md#name)
- [type](XmlChildElemOptions.md#type)
- [union](XmlChildElemOptions.md#union)

## Properties

### array

• `Optional` **array**: `boolean`

If true, the property will be parsed and serialized as an array.

#### Defined in

[src/types.ts:122](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L122)

___

### marshaller

• `Optional` **marshaller**: [`Marshaller`](Marshaller.md)<`unknown`\>

A custom marshaller.
Not compatible with the `type` and `union` options.

**`Example`**

```ts
class CapitalizedBooleanMarshaller implements Marshaller<boolean> {
   marshal(obj: boolean): string {
     return obj ? 'True' : 'False';
   }

   unmarshal(chardata: string | undefined): boolean {
     return chardata == 'True' ? true : false;
   }
}
@XmlChildElem({ marshaller: new CapitalizedBooleanMarshaller() })
isSomethingEnabled: boolean;
```

**`Example`**

```ts
const momentMarshaller: Marshaller<moment.Moment> = {
   marshal = (val: moment.Moment): string => val.toISOString(),
   unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
}
@XmlChildElem({ marshaller: momentMarshaller })
creationDateOfSomething: moment.Moment;
```

#### Defined in

[src/types.ts:102](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L102)

___

### name

• `Optional` **name**: `string`

A custom XML element name.
If not specified, the property name will be used.
It is recommended to specify it explicitly for expressiveness.

Not compatible with the `union` option, because union typed elements name is
gathered from the union's members names.

#### Defined in

[src/types.ts:132](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L132)

___

### type

• `Optional` **type**: () => [`XmlType`](../README.md#xmltype)

#### Type declaration

▸ (): [`XmlType`](../README.md#xmltype)

Specify primitive type or class type for parsing and serializing.

Not compatible with the `union` and `marshaller` options.

**`Example`**

```ts
{ type: () => String }
{ type: () => Number }
{ type: () => Boolean }
{ type: () => BigInt }
{ type: () => Date }
{ type: () => CustomClass }
```

##### Returns

[`XmlType`](../README.md#xmltype)

#### Defined in

[src/types.ts:75](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L75)

___

### union

• `Optional` **union**: () => [`XmlClass`](../README.md#xmlclass)[]

#### Type declaration

▸ (): [`XmlClass`](../README.md#xmlclass)[]

You can also specify union types, then at the parsing time
the one whose name matches the XML element name will be selected.
The serialization of union types is performed in the same manner:
the name of the class is used as the XML element name.

Union types are not compatible with the `type`, `marshaller` and `name` options.

Primitive types are not supported in unions.

**`Example`**

```ts
{ union: () => [User, Admin] }
```

##### Returns

[`XmlClass`](../README.md#xmlclass)[]

#### Defined in

[src/types.ts:117](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L117)
