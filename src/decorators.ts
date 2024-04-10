import { inspectable } from './inspectable';
import type {
    IInspectNormalizedOptions,
    IInspectOptions,
    IInspectableMetadata,
    IInspectableOptions,
    InspectedClass,
} from './types';

export const kInspectProperties = Symbol('kInspectProperties');

export const Inspectable =
    <T, P = object>(options: IInspectableOptions<T, P> = {}) =>
    (klass: InspectedClass, context: ClassDecoratorContext): void => {
        inspectable(klass, {
            ...options,

            serialize(instance) {
                const payload = (options.serialize?.(instance) ?? {}) as P;

                const metadata = (context.metadata?.[kInspectProperties] || []) as IInspectableMetadata[];

                for (const { property, options: propertyOptions } of metadata) {
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
    };

const normalizeInspectOptions = (property: string, options: IInspectOptions): IInspectNormalizedOptions => ({
    compute: options.compute ?? false,
    nullable: options.nullable ?? true,
    as: options.as ?? property,
});

export const Inspect =
    (options: IInspectOptions = {}) =>
    (target: InspectedClass, context: ClassMemberDecoratorContext): void => {
        const property = context.name as string;

        const metadata = (context.metadata?.[kInspectProperties] || []) as IInspectableMetadata[];

        if (metadata.length === 0) {
            // biome-ignore lint/style/noNonNullAssertion: context.metadata is readonly
            context.metadata![kInspectProperties] = metadata;
        }

        metadata.push({
            property,
            options: normalizeInspectOptions(property, options),
        });
    };
