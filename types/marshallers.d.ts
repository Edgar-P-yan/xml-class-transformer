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
 * // Example of a plain object that is assignable to the Marshaller interface
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
export declare class DefaultNumberMarshaller implements Marshaller<number | null | undefined> {
    marshal(value: number | null | undefined): string | undefined;
    unmarshal(chardata: string | undefined): number | null | undefined;
}
export declare class DefaultBigIntMarshaller implements Marshaller<bigint | null | undefined> {
    marshal(value: bigint | null | undefined): string | undefined;
    unmarshal(chardata: string | undefined): bigint | null | undefined;
}
export declare class DefaultStringMarshaller implements Marshaller<string | null | undefined> {
    marshal(value: string | null | undefined): string | undefined;
    unmarshal(chardata: string | undefined): string | null | undefined;
}
export declare class DefaultBooleanMarshaller implements Marshaller<boolean | null | undefined> {
    marshal(value: boolean | null | undefined): string | undefined;
    unmarshal(chardata: string | undefined): boolean | null | undefined;
}
export declare class DefaultDateMarshaller implements Marshaller<Date | null | undefined> {
    marshal(value: Date | null | undefined): string | undefined;
    unmarshal(chardata: string | undefined): Date | null | undefined;
}
export declare const defaultNumberMarshaller: DefaultNumberMarshaller;
export declare const defaultBigIntMarshaller: DefaultBigIntMarshaller;
export declare const defaultStringMarshaller: DefaultStringMarshaller;
export declare const defaultBooleanMarshaller: DefaultBooleanMarshaller;
export declare const defaultDateMarshaller: DefaultDateMarshaller;
