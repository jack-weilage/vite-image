import typescript from '@rollup/plugin-typescript'

export default [
    {
        input: 'src/index.ts',
        output: {
            format: 'cjs',
            file: "dist/index.cjs"
        },
        plugins: [ typescript() ]
    },
    {
        input: 'src/index.ts',
        output: {
            format: 'esm',
            file: "dist/index.mjs"
        },
        plugins: [ typescript() ]
    }
]