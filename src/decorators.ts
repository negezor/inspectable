import { inspectable } from './inspectable';
import type {
    IInspectableMetadata,
    IInspectableOptions,
    IInspectNormalizedOptions,
    IInspectOptions,
    InspectedClass,
} from './types';

export const kInspectProperties = Symbol('kInspectProperties');

export const Inspectable = <T, P = object>(
    options: IInspectableOptions<T, P> = {},
) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (klass: InspectedClass): void => {
        inspectable(klass, {
            ...options,

            serialize(instance) {
                const payload = (options.serialize?.(instance) || {}) as P;

                // eslint-disable-next-line @typescript-eslint/ban-types, max-len
                for (const metadata of (Reflect.getMetadata(kInspectProperties, instance as Object) || [])) {
                    const { property, options: propertyOptions } = metadata as IInspectableMetadata;

                    let value = (instance as unknown as P)[property as keyof P];

                    if (typeof value === 'function' && propertyOptions.compute) {
                        value = value.call(instance);
                    }

                    if (!propertyOptions.nullable && !value) {
                        continue;
                    }

                    payload[propertyOptions.as as keyof P] = value;
                }

                return payload;
            },
        });

        return klass;
    }
);

const normalizeInspectOptions = (
    property: string,
    options: IInspectOptions,
): IInspectNormalizedOptions => ({
    compute: options.compute ?? false,
    nullable: options.nullable ?? true,
    as: options.as ?? property,
});

export const Inspect = (options: IInspectOptions = {}) => (
    (
        target: InspectedClass,
        property: string,
    ): void => {
        // eslint-disable-next-line max-len
        const metadata = (Reflect.getMetadata(kInspectProperties, target) || []) as IInspectableMetadata[];

        if (metadata.length === 0) {
            Reflect.defineMetadata(
                kInspectProperties,
                metadata,
                target,
            );
        }

        metadata.push({
            property,
            options: normalizeInspectOptions(property, options),
        });
    }
);
