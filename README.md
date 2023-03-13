<p align="center">
<a href="https://www.npmjs.com/package/inspectable"><img src="https://img.shields.io/npm/v/inspectable.svg?style=flat-square" alt="NPM version"></a>
<a href="https://github.com/negezor/inspectable/actions/workflows/tests.yml"><img src="https://img.shields.io/github/workflow/status/negezor/inspectable/Inspectable CI?style=flat-square" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/inspectable"><img src="https://img.shields.io/npm/dt/inspectable.svg?style=flat-square" alt="NPM downloads"></a>
</p>

**Inspectable** - Make the output of a class instance in the console meaningful

| 📖 [Documentation](docs/) |
|---------------------------|

## Features

1. **Self-Sufficient.** The library has zero dependencies (except decorators support).
2. **Reliable.** The library is written in **TypeScript** and covered by tests.
3. **Modern.** The library comes with native ESM support

## Installation
> **[Node.js](https://nodejs.org/) 12.0.0 or newer is required**

- **Using `npm`** (recommended)
    ```shell
    npm i inspectable
    ```
- **Using `Yarn`**
  ```shell
  yarn add inspectable
  ```
- **Using `pnpm`**
  ```shell
  pnpm add inspectable
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
    @Inspect()
    public method = 'pay';

    private token = 'super-private';

    @Inspect({ nullable: false })
    private signal = null;

    @Inspect({ as: 'firstName' })
    private name = 'john';

    @Inspect({ compute: true })
    public canRequest() {
        return Boolean(this.token);
    }
}

const request = new APIRequest();

console.log(request);
// APIRequest {
//   method: 'pay',
//   firstName: 'john',
//   canRequest: true
// }
```
