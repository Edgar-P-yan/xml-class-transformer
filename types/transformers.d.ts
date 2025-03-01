export interface CustomTransformer<T> {
    /**
     * @param obj the object to serialize
     *
     * @returns returns the chardata as string. If returned undefined then the element will be omitted in the result.
     */
    serialize(obj: T): string | undefined;
    /**
     * @param chardata the chardata as string, or undefined if no chardata was found or the element is absence
     */
    parse(chardata: string | undefined): T;
}
export declare class DefaultNumberTransformer implements CustomTransformer<number | null | undefined> {
    serialize(value: number | null | undefined): string | undefined;
    parse(chardata: string | undefined): number | null | undefined;
}
export declare class DefaultStringTransformer implements CustomTransformer<string | null | undefined> {
    serialize(value: string | null | undefined): string | undefined;
    parse(chardata: string | undefined): string | null | undefined;
}
export declare class DefaultBooleanTransformer implements CustomTransformer<boolean | null | undefined> {
    serialize(value: boolean | null | undefined): string | undefined;
    parse(chardata: string | undefined): boolean | null | undefined;
}
export declare const defaultNumberTransformer: DefaultNumberTransformer;
export declare const defaultStringTransformer: DefaultStringTransformer;
export declare const defaultBooleanTransformer: DefaultBooleanTransformer;
//# sourceMappingURL=transformers.d.ts.map