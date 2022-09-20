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

				// eslint-disable-next-line @typescript-eslint/ban-types, max-len
				for (const property of (Reflect.getMetadata(kInspectProperties, instance as Object) || [])) {
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
	const metadata = (Reflect.getMetadata(kInspectProperties, target) || []) as string[];

	if (metadata.length === 0) {
		Reflect.defineMetadata(
			kInspectProperties,
			metadata,
			target
		);
	}

	metadata.push(property);
};
