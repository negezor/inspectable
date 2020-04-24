[inspectable](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [IInspectableContext](../interfaces/_types_.iinspectablecontext.md)
* [IInspectableOptions](../interfaces/_types_.iinspectableoptions.md)

### Type aliases

* [Constructor](_types_.md#constructor)
* [InspectableSerialize](_types_.md#inspectableserialize)
* [InspectableStringify](_types_.md#inspectablestringify)
* [NodeInspectContext](_types_.md#nodeinspectcontext)

## Type aliases

###  Constructor

Ƭ **Constructor**: *object*

Defined in types.ts:4

#### Type declaration:

___

###  InspectableSerialize

Ƭ **InspectableSerialize**: *function*

Defined in types.ts:15

#### Type declaration:

▸ (`instance`: T): *P*

**Parameters:**

Name | Type |
------ | ------ |
`instance` | T |

___

###  InspectableStringify

Ƭ **InspectableStringify**: *function*

Defined in types.ts:16

#### Type declaration:

▸ (`instance`: T, `payload`: P, `context`: [IInspectableContext](../interfaces/_types_.iinspectablecontext.md)‹P›): *string*

**Parameters:**

Name | Type |
------ | ------ |
`instance` | T |
`payload` | P |
`context` | [IInspectableContext](../interfaces/_types_.iinspectablecontext.md)‹P› |

___

###  NodeInspectContext

Ƭ **NodeInspectContext**: *typeof defaultOptions & object*

Defined in types.ts:6
