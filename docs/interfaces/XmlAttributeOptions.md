[xml-class-transformer](../README.md) / XmlAttributeOptions

# Interface: XmlAttributeOptions

## Table of contents

### Properties

- [marshaller](XmlAttributeOptions.md#marshaller)
- [name](XmlAttributeOptions.md#name)
- [type](XmlAttributeOptions.md#type)

## Properties

### marshaller

• `Optional` **marshaller**: [`Marshaller`](Marshaller.md)<`unknown`\>

A custom marshaller.
Not compatible with the `type` options.

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
@XmlAttribute({ marshaller: new CapitalizedBooleanMarshaller() })
isSomethingEnabled: boolean;
```

**`Example`**

```ts
const momentMarshaller: Marshaller<moment.Moment> = {
   marshal = (val: moment.Moment): string => val.toISOString(),
   unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
}
@XmlAttribute({ marshaller: momentMarshaller })
creationDateOfSomething: moment.Moment;
```

#### Defined in

[src/types.ts:183](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L183)

___

### name

• `Optional` **name**: `string`

XML attribute name.
If not specified, the property name will be used.

#### Defined in

[src/types.ts:140](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L140)

___

### type

• `Optional` **type**: () => [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Type declaration

▸ (): [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

XML Attributes can only be of primitive types.
Specify the primitive type for parsing and serializing the attribute.

Not compatible with the `marshaller` options.

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

[`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Defined in

[src/types.ts:156](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L156)
