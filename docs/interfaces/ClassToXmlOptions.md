[xml-class-transformer](../README.md) / ClassToXmlOptions

# Interface: ClassToXmlOptions

## Hierarchy

- `JS2XML`

  ↳ **`ClassToXmlOptions`**

## Table of contents

### Properties

- [attributeNameFn](ClassToXmlOptions.md#attributenamefn)
- [attributeValueFn](ClassToXmlOptions.md#attributevaluefn)
- [attributesFn](ClassToXmlOptions.md#attributesfn)
- [attributesKey](ClassToXmlOptions.md#attributeskey)
- [cdataFn](ClassToXmlOptions.md#cdatafn)
- [cdataKey](ClassToXmlOptions.md#cdatakey)
- [commentFn](ClassToXmlOptions.md#commentfn)
- [commentKey](ClassToXmlOptions.md#commentkey)
- [compact](ClassToXmlOptions.md#compact)
- [declaration](ClassToXmlOptions.md#declaration)
- [declarationKey](ClassToXmlOptions.md#declarationkey)
- [doctypeFn](ClassToXmlOptions.md#doctypefn)
- [doctypeKey](ClassToXmlOptions.md#doctypekey)
- [elementNameFn](ClassToXmlOptions.md#elementnamefn)
- [elementsKey](ClassToXmlOptions.md#elementskey)
- [fullTagEmptyElement](ClassToXmlOptions.md#fulltagemptyelement)
- [fullTagEmptyElementFn](ClassToXmlOptions.md#fulltagemptyelementfn)
- [ignoreAttributes](ClassToXmlOptions.md#ignoreattributes)
- [ignoreCdata](ClassToXmlOptions.md#ignorecdata)
- [ignoreComment](ClassToXmlOptions.md#ignorecomment)
- [ignoreDeclaration](ClassToXmlOptions.md#ignoredeclaration)
- [ignoreDoctype](ClassToXmlOptions.md#ignoredoctype)
- [ignoreInstruction](ClassToXmlOptions.md#ignoreinstruction)
- [ignoreText](ClassToXmlOptions.md#ignoretext)
- [indentAttributes](ClassToXmlOptions.md#indentattributes)
- [indentCdata](ClassToXmlOptions.md#indentcdata)
- [indentInstruction](ClassToXmlOptions.md#indentinstruction)
- [indentText](ClassToXmlOptions.md#indenttext)
- [instructionFn](ClassToXmlOptions.md#instructionfn)
- [instructionKey](ClassToXmlOptions.md#instructionkey)
- [instructionNameFn](ClassToXmlOptions.md#instructionnamefn)
- [nameKey](ClassToXmlOptions.md#namekey)
- [noQuotesForNativeAttributes](ClassToXmlOptions.md#noquotesfornativeattributes)
- [parentKey](ClassToXmlOptions.md#parentkey)
- [spaces](ClassToXmlOptions.md#spaces)
- [textFn](ClassToXmlOptions.md#textfn)
- [textKey](ClassToXmlOptions.md#textkey)
- [typeKey](ClassToXmlOptions.md#typekey)

## Properties

### attributeNameFn

• `Optional` **attributeNameFn**: (`attributeName`: `string`, `attributeValue`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`attributeName`, `attributeValue`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `attributeName` | `string` |
| `attributeValue` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.attributeNameFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:110

___

### attributeValueFn

• `Optional` **attributeValueFn**: (`attributeValue`: `string`, `attributeName`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`attributeValue`, `attributeName`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `attributeValue` | `string` |
| `attributeName` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.attributeValueFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:116

___

### attributesFn

• `Optional` **attributesFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.attributesFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:122

___

### attributesKey

• `Optional` **attributesKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.attributesKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:139

___

### cdataFn

• `Optional` **cdataFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.cdataFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:100

___

### cdataKey

• `Optional` **cdataKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.cdataKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:141

___

### commentFn

• `Optional` **commentFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.commentFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:101

___

### commentKey

• `Optional` **commentKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.commentKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:143

___

### compact

• `Optional` **compact**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.compact

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:86

___

### declaration

• `Optional` **declaration**: `boolean` \| { `attributes?`: `DeclarationAttributes`  }

Whether to include the default declaration line `<?xml version="1.0" encoding="UTF-8"?>` or not.

**`Default`**

true

#### Defined in

[src/types.ts:136](https://github.com/Edgar-P-yan/xml-class-transformer/blob/f1a1952/src/types.ts#L136)

___

### declarationKey

• `Optional` **declarationKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.declarationKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:137

___

### doctypeFn

• `Optional` **doctypeFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.doctypeFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:93

___

### doctypeKey

• `Optional` **doctypeKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.doctypeKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:142

___

### elementNameFn

• `Optional` **elementNameFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.elementNameFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:109

___

### elementsKey

• `Optional` **elementsKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.elementsKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:147

___

### fullTagEmptyElement

• `Optional` **fullTagEmptyElement**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.fullTagEmptyElement

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:91

___

### fullTagEmptyElementFn

• `Optional` **fullTagEmptyElementFn**: (`currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.fullTagEmptyElementFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:123

___

### ignoreAttributes

• `Optional` **ignoreAttributes**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreAttributes

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:129

___

### ignoreCdata

• `Optional` **ignoreCdata**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreCdata

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:131

___

### ignoreComment

• `Optional` **ignoreComment**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreComment

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:130

___

### ignoreDeclaration

• `Optional` **ignoreDeclaration**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreDeclaration

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:127

___

### ignoreDoctype

• `Optional` **ignoreDoctype**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreDoctype

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:132

___

### ignoreInstruction

• `Optional` **ignoreInstruction**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreInstruction

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:128

___

### ignoreText

• `Optional` **ignoreText**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.ignoreText

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:133

___

### indentAttributes

• `Optional` **indentAttributes**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.indentAttributes

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:89

___

### indentCdata

• `Optional` **indentCdata**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.indentCdata

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:88

___

### indentInstruction

• `Optional` **indentInstruction**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.indentInstruction

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:90

___

### indentText

• `Optional` **indentText**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.indentText

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:87

___

### instructionFn

• `Optional` **instructionFn**: (`instructionValue`: `string`, `instructionName`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`instructionValue`, `instructionName`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `instructionValue` | `string` |
| `instructionName` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.instructionFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:94

___

### instructionKey

• `Optional` **instructionKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.instructionKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:138

___

### instructionNameFn

• `Optional` **instructionNameFn**: (`instructionName`: `string`, `instructionValue`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`instructionName`, `instructionValue`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `instructionName` | `string` |
| `instructionValue` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.instructionNameFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:103

___

### nameKey

• `Optional` **nameKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.nameKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:146

___

### noQuotesForNativeAttributes

• `Optional` **noQuotesForNativeAttributes**: `boolean`

#### Inherited from

xmljs.Options.JS2XML.noQuotesForNativeAttributes

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:92

___

### parentKey

• `Optional` **parentKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.parentKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:144

___

### spaces

• `Optional` **spaces**: `string` \| `number`

#### Inherited from

xmljs.Options.JS2XML.spaces

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:85

___

### textFn

• `Optional` **textFn**: (`value`: `string`, `currentElementName`: `string`, `currentElementObj`: `object`) => `void`

#### Type declaration

▸ (`value`, `currentElementName`, `currentElementObj`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `currentElementName` | `string` |
| `currentElementObj` | `object` |

##### Returns

`void`

#### Inherited from

xmljs.Options.JS2XML.textFn

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:102

___

### textKey

• `Optional` **textKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.textKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:140

___

### typeKey

• `Optional` **typeKey**: `string`

#### Inherited from

xmljs.Options.JS2XML.typeKey

#### Defined in

node_modules/xml-js-v2/types/index.d.ts:145
