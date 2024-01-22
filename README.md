# xml-class-transformer

<div align="center">
  <a href="https://github.com/Edgar-P-yan/xml-class-transformer">
    <img src="https://raw.githubusercontent.com/Edgar-P-yan/xml-class-transformer/main/assets/icon.png" width="228" height="228">
  </a>
  <br>
  <br>
</div>

[![Continuous Integrations](https://github.com/Edgar-P-Yan/xml-class-transformer/actions/workflows/continuous-integrations.yaml/badge.svg?branch=main)](https://github.com/Edgar-P-Yan/xml-class-transformer/actions/workflows/continuous-integrations.yaml)
[![License](https://badgen.net/github/license/Edgar-P-Yan/xml-class-transformer)](./LICENSE)
[![NPM Badge](https://badge.fury.io/js/xml-class-transformer.svg)](https://badge.fury.io/js/xml-class-transformer)
[![install size](https://packagephobia.com/badge?p=xml-class-transformer)](https://packagephobia.com/result?p=xml-class-transformer)

`xml-class-transformer` is a library, that lets you define XML elements as regular TypeScript classes, and then parse XML into these classes and marshalize them. The whole library is heavily inspirated by GoLang's `encoding/xml`.

## Installation

```sh
npm install xml-class-transformer --save

# For Yarn, use the command below.
yarn add xml-class-transformer
```

## Quick example

```ts
@XmlElem({ name: 'Article' })
class Article {
  @XmlChildElem({ type: () => String, name: 'Title' })
  title: string;

  @XmlChildElem({ type: () => String, name: 'Content' })
  content: string;

  constructor(d?: Article) {
    Object.assign(this, d || {});
  }
}

const parsedArticle: Article = xmlToClass(
  `<Article><Title>Some title</Title><Content>The content of the article.</Content></Article>`,
  Article,
);

console.log(parsedArticle); // Article { title: 'Some title', content: 'The content of the article.' }
```

## Features

- Declarative and easy TypeScript decorators.
- Union types (`@XmlProperty({ union: () => [Employee, Manager] }) user: Employee | Manager;`).
- XML Arrays, including arrays with union types (e.g. `@XmlProperty({ type: () => [Employee, Manager], array: true }) users: (Employee | Manager)[]`).
- XML Attributes.
- XML Declarations (`<?xml version="1.0" encoding="UTF-8"?>`).
- XML Comments
- Battle-tested in production and unit coverage "> 80%".
- Complex and nested structures.
- Transformation and validation (with `class-transformer` and `class-validator`).

## Upcoming features

These are features for more uncommon usage, most projects will not need them, but I
might add support for them in the future.

- CDATA Support
- XML Namespaces
- Custom ordering
- Multiple chardata entries with the support for specified ordering.
- Custom parsers/serializers
- CLI tool for automatically generating class declarations out of an XML input. Something similar to what does [miku/zek](https://github.com/miku/zek) for GoLang.

## Table of Contents

- [Why?](#why)
- [Parsing XML to class](#parsing-xml-to-class)
- [Serializing class to XML](#serializing-class-to-xml)
- [Examples](#examples)
- [Details](#details)
- [Changelog](#changelog)
- [Installation from CDN](#installation-from-cdn)
- [API Documentation](#api-documentation)
- [License](#license)

## Why?

The need for a library like this was huge for one of the projects with an XML API I was working for. For a huge time i was searching for a beautiful was to represent data in XML, parse them, validate, without dealing with does hairy and messed up XML parsers. I was drooling over the GoLang's `encoding/xml` implementation with their struct tags, and came up with this idea of using classes with decorators.

Huge advantage of this approach is that you can also use `class-validator` and `class-transformer`, which gives you almost no limits to validation.

The library is still on it's very early stage, but we already use it in production, so don't worry to experiment with it and file an issue or pull request if you want.

## Parsing XML to class

```typescript
import {
  XmlElem,
  XmlChildElem,
  classToXml,
  xmlToClass,
} from './xml-to-class-transformer';

@XmlElem({ name: 'Article' })
class Article {
  @XmlChildElem({ type: () => String, name: 'Title' })
  title: string;

  @XmlChildElem({ type: () => String, name: 'Content' })
  content: string;

  constructor(d?: Article) {
    Object.assign(this, d || {});
  }
}

const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<Article>
  <Title>Article 1</Title>
  <Content>content 1</Content>
</Article>
`;

const parsedArticle: Article = xmlToClass(xml, Article);

console.log(parsedArticle);
// Output:
// Article { title: 'Article 1', content: 'content 1' }
```

## Serializing class to XML

```typescript
const serialized = classToXml(
  new Article({
    title: 'Article 2',
    content: 'content 2',
  }),
);

console.log(serialized);
// Output:
// <?xml version="1.0" encoding="UTF-8"?>
// <Article>
//  <Title>Article 2</Title>
//  <Content>content 2</Content>
// </Article>
```

## Examples

Take a look at the [examples](./examples).

## Details

XML is inherently not very programming-language friendly. It does not follow the common "structured" key-value approach of storing data. Because of that library developers like myself have to find some common ground between them. Generally details and pitfalls described here will not be needed to know of in ordinary projects with not too complex XML schemas. But in case if you have to thoroughly handle `null`s and `undefined`s then here you go ;)

### null and undefined handling for primitives

When serializing classes to xml all properties with `undefined` value will be excluded from the resulting xml. This is an intentional behaviour, and also in convenience with the behaviour of the `JSON.stringify` which also omits undefined values. When serializing such XMLs with omitted tags back to classes, those omitted fields will have the same `undefined` value. So in general `undefined` values are straightforward to work with.

On the other hand serializing `null` is a bit tricky: XMLs don't have such thing as null values. So we have to take some workaround: nulls for primitive types (string, number, boolean) will be serialized to empty chardata. For example this class:

```ts
class XmlNullProp {
  @XmlChildElem({ type: () => Number })
  nullProp: number | null;

  constructor(d?: XmlNullProp) {
    Object.assign(this, d || {});
  }
}
console.log(classToXml({ nullProp: null }));
```

will be serialized to:

```xml
<?xml version="1.0" encoding="UTF-8"?><XmlNullProp/>
```

Same thing goes not only for numbers, but also for booleans and strings. When serilizing back, does XML tags with empty chardatas will be converted to properties with null values. But not for strings: strings are exception in the case of null handling: when converted from XML back to Classes null strings will be converted into empty strings. In general this is an acceptable behavior, because there is not really much of a choice.

### null and undefined handling for objects

For objects handling of nulls and undefined values are a bit different too: undefined for object types will be preserved when converted back to classes. However the situation with null objects is different: because of no way to serialize null objects, null objects will become `undefined` when converted back to classes.

### null and undefined handling for arrays

For arrays nulls and `undefined`s will become empty arrays. This is because XML inherently has no way to represent arrays, the closest functionality to that it can provide is to store multiple tags with the same name.

## Changelog

All the changelog is in the [CHANGELOG.md](./CHANGELOG.md) file

## Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/xml-class-transformer"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/xml-class-transformer"></script>

<script>
  // UMD module is exposed through the "xml-class-transformer" global variable.
  console.log(window['xml-class-transformer']);
</script>
```

## API Documentation

[Documentation generated from source files by Typedoc](./docs/README.md).

## License

Released under [MIT License](./LICENSE).
