import { inspect } from 'node:util';

import type { Constructor, IInspectableContext, IInspectableOptions, NodeInspectContext } from './types';

export const inspectable = <T, P = object>(
    klass: Constructor<T>,
    {
        serialize = (): P => ({}) as P,
        stringify = (instance, payload, context): string =>
            `${context.stylize(klass.name, 'special')} ${context.inspect(payload)}`,
    }: IInspectableOptions<T, P> = {},
): void => {
    Object.defineProperty(klass.prototype, inspect.custom, {
        value(depth: number, inspectContext: NodeInspectContext) {
            const context: IInspectableContext<P> = {
                stylize: inspectContext.stylize,
                inspect: (payload, options) =>
                    inspect(payload, {
                        ...inspectContext,

                        compact: options?.compact ?? false,
                    }),
            };

            const payload = serialize(this as T);

            return stringify(this as T, payload, context);
        },
    });
};
