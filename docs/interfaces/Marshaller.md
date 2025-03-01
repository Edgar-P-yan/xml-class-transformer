[xml-class-transformer](../README.md) / Marshaller

# Interface: Marshaller<T\>

The interface for custom marshallers. If you need to implement a custom marshaller
you can either create a class that implements this interface, or a plain object that
is assignable to this interface.

**`Example`**

```ts
// Example of a class that implements this interface
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
// Example of a plain object that is assignable to the Marshaller interface
const momentMarshaller: Marshaller<moment.Moment> = {
   marshal: (val: moment.Moment): string => val.toISOString(),
   unmarshal: (chardata: string): moment.Moment => moment(chardata) ,
}
@XmlChildElem({ marshaller: momentMarshaller })
creationDateOfSomething: moment.Moment;
```

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Methods

- [marshal](Marshaller.md#marshal)
- [unmarshal](Marshaller.md#unmarshal)

## Methods

### marshal

▸ **marshal**(`obj`): `undefined` \| `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | the object to serialize |

#### Returns

`undefined` \| `string`

returns the chardata as string. If returned undefined then the element will be omitted in the result.

#### Defined in

[src/marshallers.ts:37](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/marshallers.ts#L37)

___

### unmarshal

▸ **unmarshal**(`chardata`): `T`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chardata` | `undefined` \| `string` | the chardata as string, or undefined if no chardata was found or the element is absent |

#### Returns

`T`

#### Defined in

[src/marshallers.ts:42](https://github.com/Edgar-P-yan/xml-class-transformer/blob/ff751f1/src/marshallers.ts#L42)
