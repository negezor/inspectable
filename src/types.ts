import { inspect } from 'util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InspectedClass = any;

export type NodeInspectContext = typeof inspect.defaultOptions & {
    stylize(text: string, color: string): string;
};

export interface IInspectableContext<P> {
    stylize: (text: string, color: 'special' | 'string') => string;
    inspect: (payload: P, options?: { compact?: boolean }) => string;
}

export type InspectableSerialize<T, P> = (instance: T) => P;
export type InspectableStringify<T, P> = (
    instance: T,
    payload: P,
    context: IInspectableContext<P>
) => string;

export interface IInspectableOptions<T, P> {
    serialize?: InspectableSerialize<T, P>;
    stringify?: InspectableStringify<T, P>;
}

export interface IInspectOptions {
    /**
     * Should we **compute** the value if it is a function?
     * @default false
     */
    compute?: boolean;

    /**
     * Should we output the value if it is nullable?
     * @default true
     */
    nullable?: boolean;

    /**
     * Replaces the property name with an alias in the output
     */
    as?: string;
}

export type IInspectNormalizedOptions = Required<IInspectOptions>;

export interface IInspectableMetadata {
    property: string;
    options: IInspectOptions;
}
