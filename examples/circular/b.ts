import { XmlProperty } from '../../src';
import { A } from './a';

export class B {
  @XmlProperty({ type: () => A })
  a?: A;

  constructor(d?: B) {
    Object.assign(this, d || {});
  }
}
