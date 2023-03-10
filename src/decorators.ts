import { inspectable } from './inspectable';
import { IInspectableMetadata, IInspectableOptions, InspectedClass } from './types';

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
				for (const metadata of (Reflect.getMetadata(kInspectProperties, instance as Object) || [])) {
					const { property, ...propertyOptions } = metadata as IInspectableMetadata;

					let value = (instance as unknown as P)[property as keyof P];

					if (propertyOptions.nonNullable && !value) {
						continue;
					}

					if (typeof value === 'function' && propertyOptions.execute) {
						value = value();
					}

					payload[property as keyof P] = value;
				}

				return payload;
			}
		});

		return klass;
	}
);

export const Inspect = (options: Record<string, any> = {}) => (
	(
		target: InspectedClass,
		property: string
	): void => {
		const metadata = (Reflect.getMetadata(kInspectProperties, target) || []) as IInspectableMetadata[];
	
		if (metadata.length === 0) {
			Reflect.defineMetadata(
				kInspectProperties,
				metadata,
				target
			);
		}
	
		metadata.push({
			property,
			...options
		});
	}
);
