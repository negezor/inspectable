import 'reflect-metadata';

import { inspect } from 'util';

import { Inspectable, Inspect } from '../src';

const createFixtureClass = (): new () => { method: string; token: string } => (
	class Request {
		public method = 'test';

		public token = 'super-secret';
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
				method: instance.method
			})
		})(Klass);

		expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
	});

	it('should allow you to do your own stringify', (): void => {
		const Klass = createFixtureClass();

		Inspectable({
			serialize: (instance: InstanceType<typeof Klass>) => ({
				method: instance.method
			}),
			stringify: (instance, payload, context) => (
				`Class [123] ${context.inspect(payload)}`
			)
		})(Klass);

		expect(inspect(new Klass())).toStrictEqual('Class [123] {\n  method: \'test\'\n}');
	});

	it('should work with inspect decorator', (): void => {
		const Klass = createFixtureClass();

		Inspectable({})(Klass);

		Inspect()(Klass.prototype, 'method');

		expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
	});

	// TODO: add tests for `Inspect` with options
});
