import type { RollupOptions } from 'rollup'

import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { builtinModules } from 'module'

const config = [] as RollupOptions[]
const type = process.env['BUILD_TYPE']

if (type === 'code' || !type)
    config.push({
        external: [ '@rollup/pluginutils', 'magic-string', 'sharp', 'validate', ...builtinModules ],
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
        plugins: [ esbuild({ minify: true }) ]
    })

if (type === 'types' || !type)
    config.push({
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'esm'
        },
        plugins: [ dts() ]
    })

export default config