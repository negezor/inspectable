import { inspect } from 'util';

import { inspectable } from '../src';

const createFixtureClass = (): new () => { method: string; token: string } => (
    class Request {
        public method = 'test';

        public token = 'super-secret';
    }
);

describe('inspectable', (): void => {
    it('should be an empty object', (): void => {
        const Klass = createFixtureClass();

        inspectable(Klass);

        expect(inspect(new Klass())).toStrictEqual('Request {}');
    });

    it('should have only one property', (): void => {
        const Klass = createFixtureClass();

        inspectable(Klass, {
            serialize: (instance) => ({
                method: instance.method,
            }),
        });

        expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
    });

    it('should allow you to do your own stringify', (): void => {
        const Klass = createFixtureClass();

        inspectable(Klass, {
            serialize: (instance) => ({
                method: instance.method,
            }),
            stringify: (instance, payload, context) => (
                `Class [123] ${context.inspect(payload)}`
            ),
        });

        expect(inspect(new Klass())).toStrictEqual('Class [123] {\n  method: \'test\'\n}');
    });
});
