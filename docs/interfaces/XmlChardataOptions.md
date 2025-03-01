[xml-class-transformer](../README.md) / XmlChardataOptions

# Interface: XmlChardataOptions

## Table of contents

### Properties

- [marshaller](XmlChardataOptions.md#marshaller)
- [type](XmlChardataOptions.md#type)

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
@XmlChardata({ marshaller: new CapitalizedBooleanMarshaller() })
isSomethingEnabled: boolean;
```

**`Example`**

```ts
const momentMarshaller: Marshaller<moment.Moment> = {
   marshal = (val: moment.Moment): string => val.toISOString(),
   unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
}
@XmlChardata({ marshaller: momentMarshaller })
creationDateOfSomething: moment.Moment;
```

#### Defined in

[src/types.ts:228](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L228)

___

### type

• `Optional` **type**: () => [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

#### Type declaration

▸ (): [`XmlPrimitiveType`](../README.md#xmlprimitivetype)

An XML chardata an only be of primitive types.
Specify the primitive type for parsing and serializing the chardata.

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

[src/types.ts:201](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/types.ts#L201)
