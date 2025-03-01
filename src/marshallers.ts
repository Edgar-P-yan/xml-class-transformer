/**
 * The interface for custom marshallers. If you need to implement a custom marshaller
 * you can either create a class that implements this interface, or a plain object that
 * is assignable to this interface.
 *
 * @example
 * // Example of a class that implements this interface
 * class CapitalizedBooleanMarshaller implements Marshaller<boolean> {
 *    marshal(obj: boolean): string {
 *      return obj ? 'True' : 'False';
 *    }
 *
 *    unmarshal(chardata: string | undefined): boolean {
 *      return chardata == 'True' ? true : false;
 *    }
 * }
 *
 * \@XmlChildElem({ marshaller: new CapitalizedBooleanMarshaller() })
 * isSomethingEnabled: boolean;
 *
 *
 * @example
 * // Example of a plain object that is assignable to this interface
 * const momentMarshaller: Marshaller<moment.Moment> = {
 *    marshal = (val: moment.Moment): string => val.toISOString(),
 *    unmarshal = (chardata: string): moment.Moment => moment(chardata) ,
 * }
 * \@XmlChildElem({ marshaller: momentMarshaller })
 * creationDateOfSomething: moment.Moment;
 */
export interface Marshaller<T> {
  /**
   * @param obj the object to serialize
   *
   * @returns returns the chardata as string. If returned undefined then the element will be omitted in the result.
   */
  marshal(obj: T): string | undefined;

  /**
   * @param chardata the chardata as string, or undefined if no chardata was found or the element is absent
   */
  unmarshal(chardata: string | undefined): T;
}

export class DefaultNumberMarshaller
  implements Marshaller<number | null | undefined>
{
  marshal(value: number | null | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value === null ? '' : `${value}`;
  }

  unmarshal(chardata: string | undefined): number | null | undefined {
    if (chardata === undefined) {
      return undefined;
    }

    const castToStr = `${chardata}`;

    // parse empty strings to nulls when the specified type is Number
    // because there is no convenient way to represent an empty string as a number,
    // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
    // Maybe a better idea would be to convert them to NaN just as parseFloat does.
    return castToStr === ''
      ? null
      : castToStr
      ? parseFloat(castToStr)
      : undefined;
  }
}

export class DefaultBigIntMarshaller
  implements Marshaller<bigint | null | undefined>
{
  marshal(value: bigint | null | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value === null ? '' : `${value}`;
  }

  unmarshal(chardata: string | undefined): bigint | null | undefined {
    if (chardata === undefined) {
      return undefined;
    }

    const castToStr = `${chardata}`;

    // parse empty strings to nulls when the specified type is BigInt
    // because there is no convenient way to represent an empty string as a number,
    // there is an idea to convert them to 0, but it's an implicit and non obvious behaviour.
    // Maybe a better idea would be to convert them to NaN just as parseFloat does.
    return castToStr === '' ? null : castToStr ? BigInt(castToStr) : undefined;
  }
}

export class DefaultStringMarshaller
  implements Marshaller<string | null | undefined>
{
  marshal(value: string | null | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value === null ? '' : `${value}`;
  }

  unmarshal(chardata: string | undefined): string | null | undefined {
    if (chardata === undefined) {
      return undefined;
    }

    return `${chardata}`;
  }
}

export class DefaultBooleanMarshaller
  implements Marshaller<boolean | null | undefined>
{
  marshal(value: boolean | null | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value === null ? '' : `${value}`;
  }

  unmarshal(chardata: string | undefined): boolean | null | undefined {
    if (chardata === undefined) {
      return undefined;
    }

    const castToStr = `${chardata}`;

    return castToStr === ''
      ? null
      : castToStr
      ? castToStr === 'true'
      : undefined;
  }
}

export class DefaultDateMarshaller
  implements Marshaller<Date | null | undefined>
{
  marshal(value: Date | null | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value === null ? '' : value.toISOString();
  }

  unmarshal(chardata: string | undefined): Date | null | undefined {
    if (chardata === undefined) {
      return undefined;
    }

    return chardata === '' ? null : new Date(chardata);
  }
}

export const defaultNumberMarshaller = new DefaultNumberMarshaller();
export const defaultBigIntMarshaller = new DefaultBigIntMarshaller();
export const defaultStringMarshaller = new DefaultStringMarshaller();
export const defaultBooleanMarshaller = new DefaultBooleanMarshaller();
export const defaultDateMarshaller = new DefaultDateMarshaller();
