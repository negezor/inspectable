<p align="center">
<a href="https://www.npmjs.com/package/inspectable"><img src="https://img.shields.io/npm/v/inspectable.svg?style=flat-square" alt="NPM version"></a>
<a href="https://github.com/negezor/inspectable/actions/workflows/tests.yml"><img src="https://img.shields.io/github/workflow/status/negezor/inspectable/Inspectable CI?style=flat-square" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/inspectable"><img src="https://img.shields.io/npm/dt/inspectable.svg?style=flat-square" alt="NPM downloads"></a>
</p>

Inspectable - Make the output of a class instance in the console meaningful

| 📖 [Documentation](docs/) |
|---------------------------|

## Installation
> **[Node.js](https://nodejs.org/) 12.0.0 or newer is required**

### NPM
Recommended
```
npm i inspectable
```

### Yarn
```
yarn add inspectable
```

## Example usage
```ts
import { inspectable } from 'inspectable';

class APIRequest {
	public method = 'pay';

	private token = 'super-private';
}

const request = new APIRequest();

console.log(request);
// APIRequest { method: 'pay', token: 'super-private' }

inspectable(APIRequest, {
	serialize(instance) {
		return {
			method: instance.method
		};
	}
});

console.log(request);
// APIRequest {
//   method: 'pay'
// }
```

### Decorators
```ts
import 'reflect-metadata';
import { Inspectable, Inspect } from 'inspectable';

@Inspectable({/* options */})
class APIRequest {
	@Inspect
	public method = 'pay';

	private token = 'super-private';
}

const request = new APIRequest();

console.log(request);
// APIRequest {
//   method: 'pay'
// }
```
