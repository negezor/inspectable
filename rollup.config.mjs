// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'rollup';
// eslint-disable-next-line import/no-extraneous-dependencies
import typescriptPlugin from 'rollup-plugin-typescript2';

import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join as pathJoin } from 'node:path';

const cacheRoot = pathJoin(tmpdir(), '.rpt2_cache');

const rootDir = pathJoin(fileURLToPath(import.meta.url), '..');

const src = pathJoin(rootDir, 'src');
const lib = pathJoin(rootDir, 'lib');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    input: pathJoin(src, 'index.ts'),
    plugins: [
        typescriptPlugin({
            cacheRoot,

            useTsconfigDeclarationDir: false,

            tsconfigOverride: {
                outDir: lib,
                rootDir: src,
                include: [src]
            }
        })
    ],
    external: [
        'util'
    ],
    output: [
        {
            file: pathJoin(lib, 'index.js'),
            format: 'cjs',
            exports: 'named'
        },
        {
            file: pathJoin(lib, 'index.mjs'),
            format: 'esm'
        },
        {
            file: pathJoin(lib, 'index.browser.mjs'),
            format: 'esm',
            plugins: [
                {
                    name: 'Non Node Fix',
                    renderChunk: (code) => ({
                        code: code.replace(
                            "import { inspect } from 'util';",
                            "const inspect = () => {}; inspect.custom = Symbol.for('nodejs.util.inspect.custom');"
                        )
                    })
                }
            ]
        }
    ]
});
