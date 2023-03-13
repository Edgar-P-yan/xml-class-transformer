import { expect } from 'chai';
import { classToXml, XmlEntity, XmlProperty, xmlToClass } from './index';

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
  @XmlProperty({ type: [Version, DeleteMarker], name: undefined, array: true })
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

  it('parses into array with compound type', () => {
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

  it('serializes compound typed array into xml', () => {
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
});
