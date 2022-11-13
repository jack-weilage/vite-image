import type { RollupOptions } from 'rollup'

import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { builtinModules } from 'module'

export default [
    {
        external: [ '@rollup/pluginutils', 'magic-string', 'sharp', ...builtinModules ],
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
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'esm'
        },
        plugins: [ dts() ]
    }
] as RollupOptions