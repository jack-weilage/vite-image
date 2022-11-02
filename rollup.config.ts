//TODO: Properly type distributed files.
import type { RollupOptions } from 'rollup'

import esbuild from 'rollup-plugin-esbuild'

export default {
    external: [ '@rollup/pluginutils', 'magic-string', 'sharp', 'crypto', 'path' ],
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
    plugins: [ esbuild() ]
} as RollupOptions