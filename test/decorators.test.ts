import 'reflect-metadata';

import { inspect } from 'util';

import { Inspectable, Inspect } from '../src';

const createFixtureClass = (): new () => { method: string; token: string } => (
    class Request {
        public method = 'test';

        public token = 'super-secret';

        public signal = null;

        public canRequest() {
            return Boolean(this.token);
        }
    }
);

describe('Decorators', (): void => {
    it('should be an empty object', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        expect(inspect(new Klass())).toStrictEqual('Request {}');
    });

    it('should have only one property', (): void => {
        const Klass = createFixtureClass();

        Inspectable({
            serialize: (instance: InstanceType<typeof Klass>) => ({
                method: instance.method,
            }),
        })(Klass);

        expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
    });

    it('should allow you to do your own stringify', (): void => {
        const Klass = createFixtureClass();

        Inspectable({
            serialize: (instance: InstanceType<typeof Klass>) => ({
                method: instance.method,
            }),
            stringify: (instance, payload, context) => (
                `Class [123] ${context.inspect(payload)}`
            ),
        })(Klass);

        expect(inspect(new Klass())).toStrictEqual('Class [123] {\n  method: \'test\'\n}');
    });

    it('should work with inspect decorator', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect()(Klass.prototype, 'method');

        expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
    });

    it('should work if inspect with non nullable', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect({ nullable: false })(Klass.prototype, 'signal');

        expect(inspect(new Klass())).toStrictEqual('Request {}');
    });

    it('should work if inspect with nullable', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect({ nullable: true })(Klass.prototype, 'signal');

        expect(inspect(new Klass())).toStrictEqual('Request {\n  signal: null\n}');
    });

    it('should work inspect with compute', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect({ compute: true })(Klass.prototype, 'canRequest');

        expect(inspect(new Klass())).toStrictEqual('Request {\n  canRequest: true\n}');
    });

    it('shouldn\'t work inspect with disabled compute', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect({ compute: false })(Klass.prototype, 'canRequest');

        expect(inspect(new Klass())).toStrictEqual('Request {\n  canRequest: [Function: canRequest]\n}');
    });

    it('should work inspect with alias', (): void => {
        const Klass = createFixtureClass();

        Inspectable({})(Klass);

        Inspect({ as: 'type' })(Klass.prototype, 'method');

        expect(inspect(new Klass())).toStrictEqual('Request {\n  type: \'test\'\n}');
    });
});
