import { XmlEntity, XmlProperty, xmlToClass } from '../src/index';

@XmlEntity({})
class Comment {
  @XmlProperty({ type: () => String })
  author: string;

  @XmlProperty({ type: () => String })
  text: string;

  constructor(d?: Comment) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({})
class Article {
  @XmlProperty({ type: () => String })
  title: string;

  @XmlProperty({ type: () => String })
  content: string;

  @XmlProperty({ type: () => Comment, array: true })
  comments: Comment[];

  constructor(d?: Article) {
    Object.assign(this, d || {});
  }
}

const xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <article>
    <title>Article 1</title>
    <content>content 1</content>
    <comment>
      <author>Tom</author>
      <text>Hi</text>
    </comment>
    <comment>
      <author>Bob</author>
      <text>Bye</text>
    </comment>
  </article>
`;

const parsedArticle: Article = xmlToClass(xml, Article);

console.log(parsedArticle);
/*
Output:
Article {
  title: 'Article 1',
  content: 'content 1',
  comments: [
    Comment { author: 'Tom', text: 'Hi' },
    Comment { author: 'Bob', text: 'Bye' },
  ],
}
*/

const xml2 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <article>
    <title>Article 1</title>
    <content>content 1</content>
  </article>
`;

const parsedArticle2: Article = xmlToClass(xml2, Article);

console.log(parsedArticle2);
/*
Output:
Article {
  title: 'Article 1',
  content: 'content 1',
  comments: [],
}
*/
