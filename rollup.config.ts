import type { RollupOptions } from 'rollup'

import pkg from './package.json' assert { type: 'json' }
import { builtinModules } from 'module'

import typescript from '@rollup/plugin-typescript'


export default {
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
    plugins: [ typescript() ]
} as RollupOptions