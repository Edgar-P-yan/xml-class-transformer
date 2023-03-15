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
@XmlEntity({ name: 'Article' })
class Article {
  @XmlProperty({ type: String, name: 'Title' })
  title: string;

  @XmlProperty({ type: String, name: 'Content' })
  content: string;

  constructor(d?: Version) {
    Object.assign(this, d || {});
  }
}

const parsedArticle: Article = xmlToClass(
  `<Article><Title>Article 1</Title><Content>content 1</Content></Article>`,
  Version,
);

console.log(parsedArticle); // Article { title: 'Article 1', content: 'content 1' }
```

## Features

- Declarative and easy TypeScript decorators
- XML Arrays (including arrays where elements are one of specified)
- Attributes
- XML Declaration
- Composite nested structures
- Transformation and validation (with `class-transformer` and `class-validator`)

## Table of Contents

- [Why?](#why)
- [Parsing XML to class](#parsing-xml-to-class)
- [Serializing class to XML](#serializing-class-to-xml)
- [Examples](#examples)
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
  XmlEntity,
  XmlProperty,
  classToXml,
  xmlToClass,
} from './xml-to-class-transformer';

@XmlEntity({ name: 'Article' })
class Article {
  @XmlProperty({ type: String, name: 'Title' })
  title: string;

  @XmlProperty({ type: String, name: 'Content' })
  content: string;

  constructor(d?: Version) {
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

## Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/xml-class-transformer"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/xml-class-transformer"></script>

<script>
  // UMD module is exposed through the "xml-class-transformer" global variable.
  console.log(xml-class-transformer);
</script>
```

## API Documentation

[Documentation generated from source files by Typedoc](./docs/README.md).

## License

Released under [MIT License](./LICENSE).
