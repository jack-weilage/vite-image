import type { RollupOptions } from 'rollup'

import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { builtinModules } from 'module'

const config = [] as RollupOptions[]
const mode = process.env['BUILD_TYPE']

if (mode === 'code' || !mode)
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