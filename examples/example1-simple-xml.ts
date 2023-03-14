import { XmlEntity, XmlProperty, xmlToClass } from '../src/index';

@XmlEntity({})
class Article {
  @XmlProperty({ type: String })
  title: string;

  @XmlProperty({ type: String })
  content: string;

  constructor(article?: Article) {
    Object.assign(this, article || {});
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
