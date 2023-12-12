import { XmlProperty, classToXml } from '../../src';
import { B } from './b';

export class A {
  @XmlProperty({ type: () => B })
  b: B;

  constructor(d?: A) {
    Object.assign(this, d || {});
  }
}

queueMicrotask(() => {
  const xml = classToXml(
    new B({
      a: new A({
        b: new B(),
      }),
    }),
  );

  console.log(xml);
});
