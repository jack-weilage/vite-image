import type { Options } from 'tsup'

export default {
    entry: [ 'src/index.ts' ],
    format: [ 'cjs', 'esm' ],
    minify: true
} as Options