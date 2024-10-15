import { expect } from 'chai';
import {
  XmlClass,
  classToXml,
  XmlElem,
  XmlAttribute,
  XmlChildElem,
  xmlToClass,
  XmlChardata,
  XmlComments,
} from './index';

@XmlElem({ name: 'Bucket' })
export class Bucket {
  @XmlChildElem({ name: 'Name', type: () => String })
  Name: string;

  @XmlChildElem({ name: 'CreationDate', type: () => String })
  CreationDate: string;

  constructor(d?: Bucket) {
    Object.assign(this, d || {});
  }
}

@XmlElem({ name: 'Buckets' })
export class Buckets {
  @XmlChildElem({ name: 'Bucket', type: () => Bucket, array: true })
  Bucket: Bucket[];

  constructor(d?: Buckets) {
    Object.assign(this, d || {});
  }
}

@XmlElem({ name: 'ListAllMyBucketsResult' })
export class ListAllMyBucketsResult {
  @XmlChildElem({ name: 'Buckets', type: () => Buckets })
  Buckets: Buckets;

  constructor(d?: ListAllMyBucketsResult) {
    Object.assign(this, d || {});
  }
}

@XmlElem({ name: 'Version' })
class Version {
  @XmlChildElem({ type: () => String, name: 'Id' })
  Id: string;

  @XmlChildElem({ type: () => String, name: 'Size' })
  Size: string;

  constructor(d?: Version) {
    Object.assign(this, d || {});
  }
}

@XmlElem({ name: 'DeleteMarker' })
class DeleteMarker {
  @XmlChildElem({ type: () => String, name: 'Id' })
  Id: string;

  constructor(d?: DeleteMarker) {
    Object.assign(this, d || {});
  }
}

@XmlElem({
  xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/',
  name: 'ListVersions',
})
class ListVersions {
  @XmlChildElem({ union: () => [Version, DeleteMarker], array: true })
  Versions: (Version | DeleteMarker)[];

  constructor(d?: ListVersions) {
    Object.assign(this, d || {});
  }
}

describe('xml-class-transformer', () => {
  it('serializes xml &amp; escape sequences', () => {
    class Tag {
      @XmlChildElem({ type: () => String })
      data: string;
    }

    const xml = classToXml(
      Object.assign(new Tag(), {
        data: 'content &amp; content',
      }),
    );

    console.log(xml);
    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><Tag><data>content &amp;amp; content</data></Tag>`,
    );
  });

  it('serializes ListAllMyBucketsResult', () => {
    const d = new ListAllMyBucketsResult({
      Buckets: new Buckets({
        Bucket: [
          new Bucket({
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          }),
          new Bucket({
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          }),
        ],
      }),
    });

    const xml = classToXml(d, {});

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><ListAllMyBucketsResult><Buckets>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `</Buckets></ListAllMyBucketsResult>`,
    );
  });

  it('serializes ListAllMyBucketsResult without doctype', () => {
    const d = new ListAllMyBucketsResult({
      Buckets: new Buckets({
        Bucket: [
          new Bucket({
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          }),
          new Bucket({
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          }),
        ],
      }),
    });

    const xml = classToXml(d, { declaration: false });

    expect(xml).eq(
      `<ListAllMyBucketsResult><Buckets>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `</Buckets></ListAllMyBucketsResult>`,
    );
  });

  it('serializes ListAllMyBucketsResult without initing nested classes', () => {
    const d = new ListAllMyBucketsResult({
      Buckets: new Buckets({
        Bucket: [
          {
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          },
          {
            Name: 'bucket.name',
            CreationDate: 'bucket.createdAt.toISOString()',
          },
        ],
      }),
    });

    const xml = classToXml(d, {});

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><ListAllMyBucketsResult><Buckets>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `<Bucket><Name>bucket.name</Name><CreationDate>bucket.createdAt.toISOString()</CreationDate></Bucket>` +
        `</Buckets></ListAllMyBucketsResult>`,
    );
  });

  it('does not create elements for undefined values', () => {
    const bucket = new Bucket({
      Name: 'bucket.name',
      // @ts-ignore
      CreationDate: undefined,
    });

    const xml = classToXml(bucket);

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><Bucket><Name>bucket.name</Name></Bucket>`,
    );
  });

  it('serializes nulls for primitive values to empty string', () => {
    const bucket = new Bucket({
      Name: 'bucket.name',
      // @ts-ignore
      CreationDate: null,
    });

    const xml = classToXml(bucket);

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><Bucket><Name>bucket.name</Name><CreationDate></CreationDate></Bucket>`,
    );
  });

  it('parses into array with union type', () => {
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?><ListVersions xmlns="http://s3.amazonaws.com/doc/2006-03-01/">` +
      `<Version><Id>version.id</Id><Size>version.size</Size></Version>` +
      `<DeleteMarker><Id>deleteMarker.id</Id></DeleteMarker>` +
      `</ListVersions>`;

    const result = xmlToClass(xml, ListVersions);

    expect(result).deep.eq({
      Versions: [
        {
          Id: 'version.id',
          Size: 'version.size',
        },
        {
          Id: 'deleteMarker.id',
        },
      ],
    });

    expect(result.Versions[0]).instanceOf(Version);
    expect(result.Versions[1]).instanceOf(DeleteMarker);
  });

  it('serializes union typed array into xml', () => {
    const listVersions = new ListVersions({
      Versions: [
        new Version({
          Id: 'version.id',
          Size: 'version.size',
        }),
        new DeleteMarker({
          Id: 'deleteMarker.id',
        }),
      ],
    });

    const xml = classToXml(listVersions);

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><ListVersions xmlns="http://s3.amazonaws.com/doc/2006-03-01/">` +
        `<Version><Id>version.id</Id><Size>version.size</Size></Version>` +
        `<DeleteMarker><Id>deleteMarker.id</Id></DeleteMarker>` +
        `</ListVersions>`,
    );
  });

  it('throws error if the same xml name is specified', () => {
    expect(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Article {
        @XmlChildElem({ name: 'Title', type: () => String })
        Title: string;

        @XmlChildElem({ name: 'Title', type: () => String })
        Author: string;
      }
    }).to.throw(
      Error,
      `xml-class-transformer: can't use XML element name defined ` +
        `in { name: "Title" } for Article#Author since it's already used for Article#Title. ` +
        `Change it to something else.`,
    );
  });

  it('decorator XmlAttribute works', () => {
    @XmlElem({ name: 'article' })
    class Article {
      @XmlAttribute({ type: () => String })
      language: string;

      @XmlAttribute({ name: 'comments', type: () => Number })
      comments: number;

      @XmlChildElem({
        name: 'title',
        type: () => String,
      })
      title: string;

      constructor(d?: Article) {
        Object.assign(this, d || {});
      }
    }

    expect(
      classToXml(
        new Article({
          title: 'Some article title',
          language: 'en',
          comments: 10,
        }),
      ),
    ).eq(
      '<?xml version="1.0" encoding="UTF-8"?><article language="en" comments="10"><title>Some article title</title></article>',
    );

    const _class = xmlToClass(
      '<?xml version="1.0" encoding="UTF-8"?><article language="en" comments="10"><title>Some article title</title></article>',
      Article,
    );

    expect(_class).instanceOf(Article);
    // checks if there are no extra propeties
    expect(_class).deep.eq({
      language: 'en',
      comments: 10,
      title: 'Some article title',
    });
  });

  it('throws if more than one is defined', () => {
    expect(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestMultipleCharDatas {
        @XmlChardata({ type: () => String })
        firstCharData: string;

        @XmlChardata({ type: () => String })
        secondCharDate: string;
      }
    }).to.throw('an XML element can have only one chardata property');
  });

  it('chardata works', () => {
    class TestChardata {
      @XmlChardata({ type: () => String })
      chardata: string;

      constructor(d?: TestChardata) {
        Object.assign(this, d || {});
      }
    }

    class TestNumericChardata {
      @XmlChardata({ type: () => Number })
      chardata: number;

      constructor(d?: TestNumericChardata) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new TestChardata({ chardata: 'test' }),
      TestChardata,
      `<?xml version="1.0" encoding="UTF-8"?><TestChardata>test</TestChardata>`,
    );

    testBidirConversion(
      new TestNumericChardata({ chardata: 123.234 }),
      TestNumericChardata,
      `<?xml version="1.0" encoding="UTF-8"?><TestNumericChardata>123.234</TestNumericChardata>`,
    );
  });

  it('nulls for strings transform to empty xml strings, and stay as empty strings when parsed back', () => {
    class NullPropsStr {
      @XmlChildElem({ type: () => String })
      nullPropStr: string | null;

      constructor(d?: NullPropsStr) {
        Object.assign(this, d || {});
      }
    }
    const xml = classToXml(new NullPropsStr({ nullPropStr: null }));

    expect(xml).eq(
      `<?xml version="1.0" encoding="UTF-8"?><NullPropsStr><nullPropStr></nullPropStr></NullPropsStr>`,
    );

    const backToClass = xmlToClass(xml, NullPropsStr);

    expect(backToClass).deep.eq({ nullPropStr: '' });
  });

  it('nulls for numbers transform to empty xml strings, and back to nulls when parsed back', () => {
    class NullPropsNumber {
      @XmlChildElem({ type: () => Number })
      nullPropNumber: number | null;

      constructor(d?: NullPropsNumber) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new NullPropsNumber({ nullPropNumber: null }),
      NullPropsNumber,
      `<?xml version="1.0" encoding="UTF-8"?><NullPropsNumber><nullPropNumber></nullPropNumber></NullPropsNumber>`,
    );
  });

  it('nulls for booleans transform to empty xml strings, and back to nulls when parsed back', () => {
    class NullPropsBoolean {
      @XmlChildElem({ type: () => Number })
      nullPropBoolean: boolean | null;

      constructor(d?: NullPropsBoolean) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new NullPropsBoolean({ nullPropBoolean: null }),
      NullPropsBoolean,
      `<?xml version="1.0" encoding="UTF-8"?><NullPropsBoolean><nullPropBoolean></nullPropBoolean></NullPropsBoolean>`,
    );
  });

  it('undefined for strings does not emit the xml element, and stay as undefined when parsed back', () => {
    class UndefinedPropsStr {
      @XmlChildElem({ type: () => String })
      undefinedPropStr: string | undefined;

      constructor(d?: UndefinedPropsStr) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new UndefinedPropsStr({ undefinedPropStr: undefined }),
      UndefinedPropsStr,
      `<?xml version="1.0" encoding="UTF-8"?><UndefinedPropsStr/>`,
    );
  });

  it('undefined for numbers does not emit the xml element, and stay as undefined when parsed back', () => {
    class UndefinedPropsNumber {
      @XmlChildElem({ type: () => Number })
      undefinedPropNumber: number | undefined;

      constructor(d?: UndefinedPropsNumber) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new UndefinedPropsNumber({ undefinedPropNumber: undefined }),
      UndefinedPropsNumber,
      `<?xml version="1.0" encoding="UTF-8"?><UndefinedPropsNumber/>`,
    );
  });

  it('undefined and null for nested xml entities are not emitted, and converted to undefined when parsed back', () => {
    class NestedObj {
      @XmlChardata({ type: () => String })
      text: string;
    }

    class UndefinedOrNullForObj {
      @XmlChildElem({ type: () => NestedObj })
      obj: NestedObj | undefined | null;

      constructor(d?: UndefinedOrNullForObj) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new UndefinedOrNullForObj({ obj: undefined }),
      UndefinedOrNullForObj,
      `<?xml version="1.0" encoding="UTF-8"?><UndefinedOrNullForObj/>`,
    );

    testBidirConversion(
      new UndefinedOrNullForObj({ obj: null }),
      UndefinedOrNullForObj,
      `<?xml version="1.0" encoding="UTF-8"?><UndefinedOrNullForObj/>`,
      { obj: undefined }, // null for an embedded xml entity gets casted to undefined when converted back to classes
    );
  });

  it('empty and null arrays stay as empty arrays', () => {
    class TestEmptyArrayItem {
      @XmlChildElem({ type: () => String })
      someItemProp: string;
    }

    class TestEmptyArraysRoot {
      @XmlChildElem({ type: () => TestEmptyArrayItem, array: true })
      emptyOrNullOrUndefinedArray: TestEmptyArrayItem[] | null | undefined;

      constructor(d?: TestEmptyArraysRoot) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new TestEmptyArraysRoot({ emptyOrNullOrUndefinedArray: [] }),
      TestEmptyArraysRoot,
      '<?xml version="1.0" encoding="UTF-8"?><TestEmptyArraysRoot/>',
    );

    testBidirConversion(
      new TestEmptyArraysRoot({ emptyOrNullOrUndefinedArray: null }),
      TestEmptyArraysRoot,
      '<?xml version="1.0" encoding="UTF-8"?><TestEmptyArraysRoot/>',
      new TestEmptyArraysRoot({ emptyOrNullOrUndefinedArray: [] }),
    );

    testBidirConversion(
      new TestEmptyArraysRoot({ emptyOrNullOrUndefinedArray: undefined }),
      TestEmptyArraysRoot,
      '<?xml version="1.0" encoding="UTF-8"?><TestEmptyArraysRoot/>',
      new TestEmptyArraysRoot({ emptyOrNullOrUndefinedArray: [] }),
    );
  });

  it('dont support unions of primitives', () => {
    expect(() => {
      @XmlElem()
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class _UnionOfPrimitives {
        @XmlChildElem({ union: () => [String, Number] })
        prop: string | number;
      }
    }).throws(TypeError, 'unions of primitive types');
  });

  it('different configs mixed', () => {
    @XmlElem()
    class StrProps {
      @XmlChildElem({ type: () => String })
      strPropWODefName: string;

      @XmlChildElem({ name: 'strPropWithDefinedName', type: () => String })
      strPropDefName: string;

      @XmlChildElem({ name: 'diffName', type: () => String })
      strPropDiffName: string;

      constructor(d?: StrProps) {
        Object.assign(this, d || {});
      }
    }

    // Without decorator, should work as well
    class NumberProps {
      @XmlChildElem({ type: () => Number })
      integerProp: number;

      @XmlChildElem({ type: () => Number })
      floatProp: number;

      constructor(d?: NumberProps) {
        Object.assign(this, d || {});
      }
    }

    class SomeElement {
      @XmlChildElem({ type: () => String })
      title: string;

      constructor(d?: SomeElement) {
        Object.assign(this, d || {});
      }
    }

    class AnotherElement {
      @XmlChildElem({ type: () => Number })
      val: number;

      constructor(d?: AnotherElement) {
        Object.assign(this, d || {});
      }
    }

    class CharDataElemWithAttr {
      @XmlAttribute({ type: () => String })
      attr: string;

      @XmlChardata({ type: () => String })
      strChardata: string;

      constructor(d?: CharDataElemWithAttr) {
        Object.assign(this, d || {});
      }
    }

    class NumberCharData {
      @XmlAttribute({ type: () => Number })
      attr: number;

      @XmlChardata({ type: () => Number })
      strChardata: number;

      constructor(d?: NumberCharData) {
        Object.assign(this, d || {});
      }
    }

    @XmlElem({ name: 'DiffNameAdmin' })
    class Admin {
      @XmlChildElem({ type: () => String })
      adminName: string;

      constructor(d?: Admin) {
        Object.assign(this, d || {});
      }
    }

    @XmlElem({ name: 'DiffNameUser' })
    class User {
      @XmlChildElem({ type: () => String })
      userName: string;

      constructor(d?: User) {
        Object.assign(this, d || {});
      }
    }
    class SomeComplexXmlElement {
      @XmlAttribute({ type: () => String })
      rootAttrStr: string;

      @XmlAttribute({ type: () => Number })
      rootAttrNumber: number;

      @XmlAttribute({ type: () => Number })
      possiblyNullNumberProp: number | null;

      @XmlAttribute({ type: () => Number })
      possiblyUndefinedNumberProp: number | undefined;

      @XmlChildElem({ type: () => StrProps })
      strProps: StrProps;

      @XmlChildElem({ type: () => NumberProps })
      numberProps: NumberProps;

      @XmlChildElem({ type: () => BigIntProps })
      bigintProps: BigIntProps;

      @XmlChildElem({ type: () => Boolean })
      boolProp: boolean;

      @XmlChildElem({ type: () => SomeElement })
      possiblyNullObj: SomeElement | null;

      @XmlChildElem({ type: () => SomeElement })
      possiblyUndefinedObj: SomeElement | undefined;

      @XmlChildElem({ type: () => String })
      possiblyNullStrProp: string | null;

      @XmlChildElem({ type: () => String })
      possiblyUndefinedStrProp: string | undefined;

      @XmlChildElem({ union: () => [SomeElement, AnotherElement] })
      basicUnionObj: SomeElement | AnotherElement;

      @XmlChildElem({ type: () => CharDataElemWithAttr })
      elemWithCharData: CharDataElemWithAttr;

      @XmlChildElem({ type: () => NumberCharData })
      numberChardata: NumberCharData;

      @XmlChildElem({ union: () => [User, Admin], array: true })
      usersOrAdmins: (User | Admin)[];

      constructor(d?: SomeComplexXmlElement) {
        Object.assign(this, d || {});
      }
    }

    class BigIntProps {
      @XmlChildElem({ type: () => BigInt })
      bigintProp: bigint;
      constructor(d?: BigIntProps) {
        Object.assign(this, d || {});
      }
    }

    const input = new SomeComplexXmlElement({
      rootAttrStr: 'a string attribute',
      rootAttrNumber: 123.123124,
      possiblyNullNumberProp: null,
      possiblyUndefinedNumberProp: undefined,
      strProps: new StrProps({
        strPropDefName: 'some value',
        strPropDiffName: 'some other value',
        strPropWODefName: 'another value',
      }),
      numberProps: new NumberProps({
        integerProp: Number.MAX_SAFE_INTEGER,
        floatProp: 10.0101,
      }),
      bigintProps: new BigIntProps({
        bigintProp: BigInt(42),
      }),
      boolProp: true,

      possiblyNullObj: null, // will be undefined when we convert it back to classes
      possiblyUndefinedObj: undefined,

      possiblyNullStrProp: null, // will be an empty string when we convert it back to classes

      possiblyUndefinedStrProp: undefined, // will stay as undefined when we convert it back to classes

      basicUnionObj: new AnotherElement({ val: 10 }),

      elemWithCharData: new CharDataElemWithAttr({
        attr: 'some attr val',
        strChardata:
          'some literal value that should be escaped test with <eval haha="fu"></eval>',
      }),

      numberChardata: new NumberCharData({
        attr: 234.34,
        strChardata: 43747.23423,
      }),

      usersOrAdmins: [
        // @ts-expect-error
        null,
        new User({
          userName: 'user name',
        }),
        new Admin({
          adminName: 'aasdf',
        }),
        // @ts-expect-error
        undefined,
        new Admin({
          adminName: 'asdfwereqwr',
        }),
        new User({
          userName: 'werwer asdf',
        }),
        // @ts-expect-error
        null,
        // @ts-expect-error
        undefined,
        // test also null and undefined values, they should be ignored by the library
      ],
    });

    const xml = classToXml(
      input,
      //  , { spaces: 2 }
    );

    console.log(xml);

    expect(xml).eq(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<SomeComplexXmlElement rootAttrStr="a string attribute" ' +
        'rootAttrNumber="123.123124" possiblyNullNumberProp=""><strProps><strPropWODefName>another value' +
        '</strPropWODefName><strPropWithDefinedName>some value</strPropWithDefinedName><diffName>some other ' +
        'value</diffName></strProps><numberProps><integerProp>9007199254740991</integerProp><floatProp>10.0101' +
        '</floatProp></numberProps><bigintProps><bigintProp>42</bigintProp></bigintProps>' +
        '<boolProp>true</boolProp><possiblyNullStrProp></possiblyNullStrProp><AnotherElement>' +
        '<val>10</val></AnotherElement><elemWithCharData attr="some attr val">some literal value that should be escaped ' +
        'test with &lt;eval haha="fu"&gt;&lt;/eval&gt;</elemWithCharData><numberChardata attr="234.34">43747.23423' +
        '</numberChardata><DiffNameUser><userName>user name</userName></DiffNameUser><DiffNameAdmin><adminName>aasdf' +
        '</adminName></DiffNameAdmin><DiffNameAdmin><adminName>asdfwereqwr</adminName></DiffNameAdmin><DiffNameUser>' +
        '<userName>werwer asdf</userName></DiffNameUser></SomeComplexXmlElement>',
    );
    const backToClass = xmlToClass(xml, SomeComplexXmlElement);

    console.dir(backToClass, { deptjh: null });

    expect(backToClass).deep.eq({
      ...input,
      possiblyNullObj: undefined, // null objects should be turned unto undefined when parsed back to classes
      possiblyNullStrProp: '', // null strings should be parsed into empty strings when parsed back to classes. numbers and booleans will still be nulls.
      usersOrAdmins: input.usersOrAdmins.filter(
        (item) => item !== null && item !== undefined,
      ), // nulls and undefineds should be lost when converting back to classes
    });
  });

  describe('comments', () => {
    @XmlElem()
    class TestComments {
      @XmlComments()
      comments?: string[] | null;

      constructor(d?: TestComments) {
        Object.assign(this, d || {});
      }
    }

    @XmlElem()
    class TestCommentsWithOtherElems {
      @XmlChildElem({ type: () => String })
      elemAbove?: string;

      @XmlComments()
      comments?: string[] | null;

      @XmlChildElem({ type: () => String })
      elemBelow?: string;

      constructor(d?: TestCommentsWithOtherElems) {
        Object.assign(this, d || {});
      }
    }

    it('parses and serializes one and more comments', () => {
      testBidirConversion(
        new TestComments({ comments: ['some comment'] }),
        TestComments,
        '<?xml version="1.0" encoding="UTF-8"?><TestComments><!--some comment--></TestComments>',
      );

      testBidirConversion(
        new TestComments({ comments: ['some comment', 'another comment'] }),
        TestComments,
        '<?xml version="1.0" encoding="UTF-8"?><TestComments><!--some comment--><!--another comment--></TestComments>',
      );

      testBidirConversion(
        new TestComments({}),
        TestComments,
        '<?xml version="1.0" encoding="UTF-8"?><TestComments/>',
        { comments: [] },
      );

      testBidirConversion(
        new TestComments({ comments: null }),
        TestComments,
        '<?xml version="1.0" encoding="UTF-8"?><TestComments/>',
        { comments: [] },
      );
    });

    it('parses and serializes comments with other elements', () => {
      testBidirConversion(
        new TestCommentsWithOtherElems({
          elemAbove: 'str',
          comments: ['comments'],
          elemBelow: 'str2',
        }),
        TestCommentsWithOtherElems,
        '<?xml version="1.0" encoding="UTF-8"?><TestCommentsWithOtherElems>' +
          '<elemAbove>str</elemAbove><!--comments--><elemBelow>str2</elemBelow>' +
          '</TestCommentsWithOtherElems>',
        { elemAbove: 'str', comments: ['comments'], elemBelow: 'str2' },
      );
    });
  });

  it('works with arrays of primitives', () => {
    @XmlElem()
    class ArrayOfPrimitives {
      @XmlChildElem({ type: () => String, array: true })
      prop: string[];

      constructor(d?: ArrayOfPrimitives) {
        Object.assign(this, d || {});
      }
    }

    testBidirConversion(
      new ArrayOfPrimitives({ prop: ['a', 'b', 'c'] }),
      ArrayOfPrimitives,
      '<?xml version="1.0" encoding="UTF-8"?><ArrayOfPrimitives><prop>a</prop><prop>b</prop><prop>c</prop></ArrayOfPrimitives>',
      { prop: ['a', 'b', 'c'] },
    );
  });

  it('concatenates text nodes', () => {
    @XmlElem()
    class ConcatTextNodes {
      @XmlChardata({ type: () => String })
      chardata: string;
    }

    const xml = `
      <ConcatTextNodes>first text node <UnknownElem />second text node <!-- some comment -->third text node</ConcatTextNodes>
    `;

    expect(xmlToClass(xml, ConcatTextNodes)).deep.eq({
      chardata: 'first text node second text node third text node',
    });
  });
});

function testBidirConversion(
  input: any,
  classType: XmlClass,
  expectedXml: string,
  expectedObj?: any,
): void {
  const xml = classToXml(input);
  console.log('testBidirConversion:', xml);
  expect(xml).eq(expectedXml);

  const backToClass = xmlToClass(xml, classType);

  expect(backToClass).deep.eq(expectedObj || input);
}
