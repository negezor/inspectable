import { inspect } from 'util';

import {
    IInspectableOptions,
    IInspectableContext,

    Constructor,
    NodeInspectContext
} from './types';

export const inspectable = <T, P = object>(
    klass: Constructor<T>,
    {
        serialize = (): P => ({} as P),
        stringify = (instance, payload, context): string => (
            `${context.stylize(klass.name, 'special')} ${context.inspect(payload)}`
        )
    }: IInspectableOptions<T, P> = {}
): void => {
    Object.defineProperty(klass.prototype, inspect.custom, {
        value(depth: number, inspectContext: NodeInspectContext) {
            const context: IInspectableContext<P> = {
                stylize: inspectContext.stylize,
                inspect: (payload, options) => (
                    inspect(payload, {
                        ...inspectContext,

                        compact: options?.compact ?? false
                    })
                )
            };

            const payload = serialize(this);

            return stringify(this, payload, context);
        }
    });
};
