# xml-class-transformer

[![Continuous Integrations](https://github.com/Edgar-P-Yan/xml-class-transformer/actions/workflows/continuous-integrations.yaml/badge.svg?branch=main)](https://github.com/Edgar-P-Yan/xml-class-transformer/actions/workflows/continuous-integrations.yaml)
[![License](https://badgen.net/github/license/Edgar-P-Yan/xml-class-transformer)](./LICENSE)
[![Package tree-shaking](https://badgen.net/bundlephobia/tree-shaking/xml-class-transformer)](https://bundlephobia.com/package/xml-class-transformer)
[![Package minified & gzipped size](https://badgen.net/bundlephobia/minzip/xml-class-transformer)](https://bundlephobia.com/package/xml-class-transformer)
[![Package dependency count](https://badgen.net/bundlephobia/dependency-count/reactxml-class-transformer)](https://bundlephobia.com/package/xml-class-transformer)

## Installation

```sh
npm install xml-class-transformer --save

# For Yarn, use the command below.
yarn add xml-class-transformer
```

## What is this

The need for a library like this was huge for one of the projects with an XML API I was working for. For a huge time i was searching for a beautiful was to represent data in XML, parse them, validate, without dealing with does hairy and messed up XML parsers. I was drooling over the GoLang's `encoding/xml` implementation with their struct tags, and came up with this idea of using classes with decorators.

Huge advantage of this approach is that you can also use `class-validator` and `class-transformer`, which gives you almost no limits to validation.

The library is still on it's very early stage, but we already use it in production, so don't worry to experiment with it and file an issue or pull request if you want.

## How to use

For more detailed examples please look at the unit tests `src/index.test.ts`.

### Example of parsing XML to class

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

const parsedArticle: Article = xmlToClass(xml, Version);

console.log(parsedArticle);
// Output:
// Article { title: 'Article 1', content: 'content 1' }
```

### Example of serializing class to XML

```ts
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

## Documentation

[Documentation generated from source files by Typedoc](./docs/README.md).

## License

Released under [MIT License](./LICENSE).
