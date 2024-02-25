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

const useCreateFixtureDecoratorContext = () => {
    const metadata = {};

    return {
        classContext: (): ClassDecoratorContext => ({
            name: 'Request',
            metadata,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            addInitializer() {},
            kind: 'class',
        }),
        // @ts-expect-error kind override
        memberContext: (name: string, kind: ClassMemberDecoratorContext['kind']): ClassMemberDecoratorContext => ({
            name: name,
            metadata,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            addInitializer() {},
            kind: kind,
            access: {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                get() {},
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                set() {},
                has() { return true },
            },
            private: false,
            static: false,
        }),
    };
};

describe('Decorators', (): void => {
    it('should be an empty object', (): void => {
        const Klass = createFixtureClass();

        const { classContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        expect(inspect(new Klass())).toStrictEqual('Request {}');
    });

    it('should have only one property', (): void => {
        const Klass = createFixtureClass();

        const { classContext } = useCreateFixtureDecoratorContext();

        Inspectable({
            serialize: (instance: InstanceType<typeof Klass>) => ({
                method: instance.method,
            }),
        })(Klass, classContext());

        expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
    });

    it('should allow you to do your own stringify', (): void => {
        const Klass = createFixtureClass();

        const { classContext } = useCreateFixtureDecoratorContext();

        Inspectable({
            serialize: (instance: InstanceType<typeof Klass>) => ({
                method: instance.method,
            }),
            stringify: (instance, payload, context) => (
                `Class [123] ${context.inspect(payload)}`
            ),
        })(Klass, classContext());

        expect(inspect(new Klass())).toStrictEqual('Class [123] {\n  method: \'test\'\n}');
    });

    it('should work with inspect decorator', (): void => {
        const Klass = createFixtureClass();

        const { classContext, memberContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        Inspect()(Klass.prototype, memberContext('method', 'field'));

        expect(inspect(new Klass())).toStrictEqual('Request {\n  method: \'test\'\n}');
    });

    it('should work if inspect with non nullable', (): void => {
        const Klass = createFixtureClass();

        const { classContext, memberContext } = useCreateFixtureDecoratorContext();
        
        Inspectable({})(Klass, classContext());

        Inspect({ nullable: false })(Klass.prototype, memberContext('signal', 'field'));

        expect(inspect(new Klass())).toStrictEqual('Request {}');
    });

    it('should work if inspect with nullable', (): void => {
        const Klass = createFixtureClass();

        const { classContext, memberContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        Inspect({ nullable: true })(Klass.prototype, memberContext('signal', 'field'));

        expect(inspect(new Klass())).toStrictEqual('Request {\n  signal: null\n}');
    });

    it('should work inspect with compute', (): void => {
        const Klass = createFixtureClass();

        const { classContext, memberContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        Inspect({ compute: true })(Klass.prototype, memberContext('canRequest', 'method'));

        expect(inspect(new Klass())).toStrictEqual('Request {\n  canRequest: true\n}');
    });

    it('shouldn\'t work inspect with disabled compute', (): void => {
        const Klass = createFixtureClass();
        
        const { classContext, memberContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        Inspect({ compute: false })(Klass.prototype, memberContext('canRequest', 'method'));

        expect(inspect(new Klass())).toStrictEqual('Request {\n  canRequest: [Function: canRequest]\n}');
    });

    it('should work inspect with alias', (): void => {
        const Klass = createFixtureClass();

        const { classContext, memberContext } = useCreateFixtureDecoratorContext();

        Inspectable({})(Klass, classContext());

        Inspect({ as: 'type' })(Klass.prototype, memberContext('method', 'field'));

        expect(inspect(new Klass())).toStrictEqual('Request {\n  type: \'test\'\n}');
    });
});
