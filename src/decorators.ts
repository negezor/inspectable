import { inspectable } from './inspectable';
import { IInspectableOptions, InspectedClass } from './types';

export const kInspectProperties = Symbol('kInspectProperties');

export const Inspectable = <T, P = object>(
	options: IInspectableOptions<T, P> = {}
) => (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(klass: InspectedClass): void => {
		inspectable(klass, {
			...options,

			serialize(instance) {
				const payload = (options.serialize?.(instance) || {}) as P;

				for (const property of (klass[kInspectProperties] || [])) {
					payload[property as keyof P] = (instance as unknown as P)[property as keyof P];
				}

				return payload;
			}
		});

		return klass;
	}
);

export const Inspect = (
	target: InspectedClass,
	property: string
): void => {
	if (target.constructor[kInspectProperties] === undefined) {
		target.constructor[kInspectProperties] = [];
	}

	target.constructor[kInspectProperties].push(property);
};
