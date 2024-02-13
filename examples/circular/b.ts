import { XmlChildElem } from '../../src';
import { A } from './a';

export class B {
  @XmlChildElem({ type: () => A })
  a?: A;

  constructor(d?: B) {
    Object.assign(this, d || {});
  }
}
