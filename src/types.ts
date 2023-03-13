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
	/** Should we **recompute** the value if it is a function? */
	execute?: boolean;

	/** Should we **only** output the value if it is non-nullable? */
	nonNullable?: boolean;
}

export interface IInspectableMetadata {
	property: string;
	options: IInspectOptions;
}
