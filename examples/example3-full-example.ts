import {
  XmlElem,
  XmlChildElem,
  // xmlToClass,
  XmlComments,
  XmlAttribute,
  XmlChardata,
  classToXml,
  xmlToClass,
} from '../src/index';

/**
 * This represents an XML element that looks like this:
 *
 * ```xml
 * <article>
 *   <title>Article 1</title>
 *   <authors>Tom</authors>
 *   <authors>Bob</authors>
 *   <reviews language="en" date="2020-01-01" author-id="1">contents text</reviews>
 *   <reviews language="en" date="2020-01-01" author-id="2">contents text</reviews>
 *   <!--some comment-->
 *   <!--some other comment-->
 * </article>
 * ```
 */
@XmlElem({ name: 'article' })
class Article {
  @XmlChildElem({ type: () => String })
  title: string;

  @XmlChildElem({ type: () => String, name: 'author', array: true })
  authors: string[];

  @XmlChildElem({ type: () => Review, array: true })
  reviews: Review[];

  @XmlComments()
  xmlComments: string[];

  constructor(article?: Article) {
    Object.assign(this, article || {});
  }
}

/**
 * This represents an XML element like this one:
 *
 * ```xml
 * <review language="en" date="2020-01-01" author-id="1">
 *   contents text
 * </review>
 */
@XmlElem({ name: 'review' })
class Review {
  @XmlAttribute({ name: 'language', type: () => String })
  lang: string;

  @XmlAttribute({ name: 'date', type: () => String })
  date: string;

  @XmlAttribute({ name: 'author-id', type: () => Number })
  authorId: number;

  @XmlChardata({ type: () => String })
  text: string;

  constructor(review?: Review) {
    Object.assign(this, review || {});
  }
}

const marshalledXml = classToXml(
  new Article({
    title: 'Article 1',
    reviews: [
      new Review({
        authorId: 1,
        date: '2020-01-01',
        lang: 'en',
        text: 'contents text',
      }),
      new Review({
        authorId: 2,
        date: '2020-01-01',
        lang: 'en',
        text: 'contents text',
      }),
    ],
    authors: ['Tom', 'Bob'],
    xmlComments: ['some comment', 'some other comment'],
  }),
  { spaces: 2 },
);

console.log(marshalledXml);

/**
 * Output:
 * ```xml
 * <article>
 *   <title>Article 1</title>
 *   <authors>Tom</authors>
 *   <authors>Bob</authors>
 *   <reviews language="en" date="2020-01-01" author-id="1">contents text</reviews>
 *   <reviews language="en" date="2020-01-01" author-id="2">contents text</reviews>
 *   <!--some comment-->
 *   <!--some other comment-->
 * </article>
 * ```
 */

const unmarshalledXml = xmlToClass(marshalledXml, Article);
console.log(unmarshalledXml);
/**
 * Output:
 * ```xml
 * Article {
 *   title: 'Article 1',
 *   authors: [ 'Tom', 'Bob' ],
 *   reviews: [
 *     Review {
 *       lang: 'en',
 *       date: '2020-01-01',
 *       authorId: 1,
 *       text: 'contents text'
 *     },
 *     Review {
 *       lang: 'en',
 *       date: '2020-01-01',
 *       authorId: 2,
 *       text: 'contents text'
 *     }
 *   ],
 *   xmlComments: [ 'some comment', 'some other comment' ]
 * }
 * ```
 */
