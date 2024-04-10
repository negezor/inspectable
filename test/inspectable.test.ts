import { inspect } from 'node:util';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

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

        strictEqual(inspect(new Klass()), 'Request {}');
    });

    it('should have only one property', (): void => {
        const Klass = createFixtureClass();

        inspectable(Klass, {
            serialize: (instance) => ({
                method: instance.method,
            }),
        });

        strictEqual(inspect(new Klass()), 'Request {\n  method: \'test\'\n}');
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

        strictEqual(inspect(new Klass()), 'Class [123] {\n  method: \'test\'\n}');
    });
});
