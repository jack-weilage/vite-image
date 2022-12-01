import type { RollupOptions } from 'rollup'

import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

import { builtinModules, createRequire } from 'module'

const require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- We're importing a JSON file, TypeScript won't be happy.
const pkg = require('./package.json')

const config = [] as RollupOptions[]
const mode = process.env['BUILD_TYPE']

if (mode === 'code' || !mode)
    config.push({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- Again, importing JSON.
        external: [ ...Object.keys(pkg.dependencies), ...builtinModules ],
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                exports: 'auto'
            },
            {
                file: 'dist/index.mjs',
                format: 'esm',
                exports: 'auto'
            }
        ],
        plugins: [
            esbuild({ minify: true }),
            getBabelOutputPlugin({
                targets: { node: '14' },
                presets: [ '@babel/preset-env' ]
            })
        ]
    })

if (mode === 'types' || !mode)
    config.push({
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'esm'
        },
        plugins: [ dts() ]
    })

export default config