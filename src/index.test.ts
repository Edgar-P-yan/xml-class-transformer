import { expect } from 'chai';
import {
  AnyClass,
  classToXml,
  XmlEntity,
  XmlAttribute,
  XmlProperty,
  xmlToClass,
} from './index';

@XmlEntity({ name: 'Bucket' })
export class Bucket {
  @XmlProperty({ name: 'Name', type: String })
  Name: string;

  @XmlProperty({ name: 'CreationDate', type: String })
  CreationDate: string;

  constructor(d?: Bucket) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({ name: 'Buckets' })
export class Buckets {
  @XmlProperty({ name: 'Bucket', type: Bucket, array: true })
  Bucket: Bucket[];

  constructor(d?: Buckets) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({ name: 'ListAllMyBucketsResult' })
export class ListAllMyBucketsResult {
  @XmlProperty({ name: 'Buckets', type: Buckets })
  Buckets: Buckets;

  constructor(d?: ListAllMyBucketsResult) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({ name: 'Version' })
class Version {
  @XmlProperty({ type: String, name: 'Id' })
  Id: string;

  @XmlProperty({ type: String, name: 'Size' })
  Size: string;

  constructor(d?: Version) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({ name: 'DeleteMarker' })
class DeleteMarker {
  @XmlProperty({ type: String, name: 'Id' })
  Id: string;

  constructor(d?: DeleteMarker) {
    Object.assign(this, d || {});
  }
}

@XmlEntity({
  xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/',
  name: 'ListVersions',
})
class ListVersions {
  @XmlProperty({ union: [Version, DeleteMarker], array: true })
  Versions: (Version | DeleteMarker)[];

  constructor(d?: ListVersions) {
    Object.assign(this, d || {});
  }
}

describe('xml-class-transformer', () => {
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
        @XmlProperty({ name: 'Title', type: String })
        Title: string;

        @XmlProperty({ name: 'Title', type: String })
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
    @XmlEntity({ name: 'article' })
    class Article {
      @XmlAttribute({ type: String })
      language: string;

      @XmlAttribute({ name: 'comments', type: Number })
      comments: number;

      @XmlProperty({
        name: 'title',
        type: String,
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

  it('throws if more than one chardata is defined', () => {
    expect(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestMultipleCharDatas {
        @XmlProperty({ type: String, chardata: true })
        firstCharData: string;

        @XmlProperty({ type: String, chardata: true })
        secondCharDate: string;
      }
    }).to.throw('an XML element can have only one chardata property');
  });

  it('chardata works', () => {
    class TestChardata {
      @XmlProperty({ type: String, chardata: true })
      chardata: string;

      constructor(d?: TestChardata) {
        Object.assign(this, d || {});
      }
    }

    class TestNumericChardata {
      @XmlProperty({ type: Number, chardata: true })
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
      @XmlProperty({ type: String })
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
      @XmlProperty({ type: Number })
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
      @XmlProperty({ type: Number })
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
      @XmlProperty({ type: String })
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
      @XmlProperty({ type: Number })
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
      @XmlProperty({ chardata: true, type: String })
      text: string;
    }

    class UndefinedOrNullForObj {
      @XmlProperty({ type: NestedObj })
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
      @XmlProperty({ type: String })
      someItemProp: string;
    }

    class TestEmptyArraysRoot {
      @XmlProperty({ type: TestEmptyArrayItem, array: true })
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
      @XmlEntity()
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class _UnionOfPrimitives {
        @XmlProperty({ union: [String, Number] })
        prop: string | number;
      }
    }).throws(TypeError, 'unions of primitive types');
  });

  it('different configs mixed', () => {
    @XmlEntity()
    class StrProps {
      @XmlProperty({ type: String })
      strPropWODefName: string;

      @XmlProperty({ name: 'strPropWithDefinedName', type: String })
      strPropDefName: string;

      @XmlProperty({ name: 'diffName', type: String })
      strPropDiffName: string;

      constructor(d?: StrProps) {
        Object.assign(this, d || {});
      }
    }

    // Without decorator, should work as well
    class NumberProps {
      @XmlProperty({ type: Number })
      integerProp: number;

      @XmlProperty({ type: Number })
      floatProp: number;

      constructor(d?: NumberProps) {
        Object.assign(this, d || {});
      }
    }

    class SomeElement {
      @XmlProperty({ type: String })
      title: string;

      constructor(d?: SomeElement) {
        Object.assign(this, d || {});
      }
    }

    class AnotherElement {
      @XmlProperty({ type: Number })
      val: number;

      constructor(d?: AnotherElement) {
        Object.assign(this, d || {});
      }
    }

    class CharDataElemWithAttr {
      @XmlAttribute({ type: String })
      attr: string;

      @XmlProperty({ chardata: true, type: String })
      strChardata: string;

      constructor(d?: CharDataElemWithAttr) {
        Object.assign(this, d || {});
      }
    }

    class NumberCharData {
      @XmlAttribute({ type: Number })
      attr: number;

      @XmlProperty({ chardata: true, type: Number })
      strChardata: number;

      constructor(d?: NumberCharData) {
        Object.assign(this, d || {});
      }
    }

    @XmlEntity({ name: 'DiffNameAdmin' })
    class Admin {
      @XmlProperty({ type: String })
      adminName: string;

      constructor(d?: Admin) {
        Object.assign(this, d || {});
      }
    }

    @XmlEntity({ name: 'DiffNameUser' })
    class User {
      @XmlProperty({ type: String })
      userName: string;

      constructor(d?: User) {
        Object.assign(this, d || {});
      }
    }
    class SomeComplexXmlElement {
      @XmlAttribute({ type: String })
      rootAttrStr: string;

      @XmlAttribute({ type: Number })
      rootAttrNumber: number;

      @XmlAttribute({ type: Number })
      possiblyNullNumberProp: number | null;

      @XmlAttribute({ type: Number })
      possiblyUndefinedNumberProp: number | undefined;

      @XmlProperty({ type: StrProps })
      strProps: StrProps;

      @XmlProperty({ type: NumberProps })
      numberProps: NumberProps;

      @XmlProperty({ type: Boolean })
      boolProp: boolean;

      @XmlProperty({ type: SomeElement })
      possiblyNullObj: SomeElement | null;

      @XmlProperty({ type: SomeElement })
      possiblyUndefinedObj: SomeElement | undefined;

      @XmlProperty({ type: String })
      possiblyNullStrProp: string | null;

      @XmlProperty({ type: String })
      possiblyUndefinedStrProp: string | undefined;

      @XmlProperty({ union: [SomeElement, AnotherElement] })
      basicUnionObj: SomeElement | AnotherElement;

      @XmlProperty({ type: CharDataElemWithAttr })
      elemWithCharData: CharDataElemWithAttr;

      @XmlProperty({ type: NumberCharData })
      numberChatdata: NumberCharData;

      @XmlProperty({ union: [User, Admin], array: true })
      usersOrAdmins: (User | Admin)[];

      constructor(d?: SomeComplexXmlElement) {
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

      numberChatdata: new NumberCharData({
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
      '<?xml version="1.0" encoding="UTF-8"?><SomeComplexXmlElement rootAttrStr="a string attribute" ' +
        'rootAttrNumber="123.123124" possiblyNullNumberProp=""><strProps><strPropWODefName>another value' +
        '</strPropWODefName><strPropWithDefinedName>some value</strPropWithDefinedName><diffName>some other ' +
        'value</diffName></strProps><numberProps><integerProp>9007199254740991</integerProp><floatProp>10.0101' +
        '</floatProp></numberProps><boolProp>true</boolProp><possiblyNullStrProp></possiblyNullStrProp><AnotherElement>' +
        '<val>10</val></AnotherElement><elemWithCharData attr="some attr val">some literal value that should be escaped ' +
        'test with &lt;eval haha="fu"&gt;&lt;/eval&gt;</elemWithCharData><numberChatdata attr="234.34">43747.23423' +
        '</numberChatdata><DiffNameUser><userName>user name</userName></DiffNameUser><DiffNameAdmin><adminName>aasdf' +
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
});

function testBidirConversion(
  input: any,
  classType: AnyClass,
  expectedXml: string,
  expectedObj?: any,
): void {
  const xml = classToXml(input);
  console.log('testBidirConversion:', xml);
  expect(xml).eq(expectedXml);

  const backToClass = xmlToClass(xml, classType);

  expect(backToClass).deep.eq(expectedObj || input);
}
