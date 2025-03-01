import moment from 'moment';
import { Marshaller, XmlChildElem, XmlElem } from '../src/index';

/**
 * An example of a custom marshaller that
 * converts a chardata to a moment.Moment object
 * in case you don't want the built-in support for
 * javascript Date objects.
 */
const momentMarshaller: Marshaller<moment.Moment> = {
  marshal: (val: moment.Moment): string => val.toISOString(),
  unmarshal: (chardata: string | undefined): moment.Moment => moment(chardata),
};

/**
 * Formats numbers so `123456.123` becomes `"1,234,561.23"`
 */
const formattedNumberMarshaller: Marshaller<number> = {
  marshal: (val: number): string => val.toLocaleString('en'),
  unmarshal: (chardata: string | undefined): number =>
    chardata ? parseFloat(chardata.replace(/,/g, '')) : 0,
};

/**
 * Just parses JSONs. Further, you could add
 * validation using class-validator library.
 */
const jsonMarshaller: Marshaller<any> = {
  marshal: (val: any): string => JSON.stringify(val),
  unmarshal: (chardata: string | undefined): any =>
    chardata ? JSON.parse(chardata) : null,
};

@XmlElem()
class Article {
  @XmlChildElem({ marshaller: momentMarshaller })
  modifiedAt: moment.Moment;

  @XmlChildElem({ marshaller: formattedNumberMarshaller })
  viewCount: number;

  @XmlChildElem({ marshaller: jsonMarshaller })
  detailsAsJson: any;
}
