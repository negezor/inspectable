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
    (klass: InspectedClass, context: ClassDecoratorContext): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        inspectable(klass, {
            ...options,

            serialize(instance) {
                const payload = (options.serialize?.(instance) ?? {}) as P;

                const metadata = (context.metadata?.[kInspectProperties] || []) as IInspectableMetadata[];
                
                for (const { property, options: propertyOptions } of metadata) {
                    let value = (instance as unknown as P)[property as keyof P];

                    if (typeof value === 'function' && propertyOptions.compute) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        context: ClassMemberDecoratorContext,
    ): void => {
        const property = context.name as string;

        const metadata = (context.metadata?.[kInspectProperties] || []) as IInspectableMetadata[];

        if (metadata.length === 0) {
            context.metadata![kInspectProperties] = metadata;
        }

        metadata.push({
            property,
            options: normalizeInspectOptions(property, options),
        });
    }
);
