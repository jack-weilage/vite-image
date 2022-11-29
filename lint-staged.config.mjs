const tsconfig = '--target es2022 --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --module esnext --moduleResolution node --allowSyntheticDefaultImports --strict'
export default {
    '**/*.ts': (/** @type string[] */ filenames) => [
        `concurrently ${filenames
            .map(filename => `"tsc ${filename} ${tsconfig}"`)
            .join(' ')}`,
        `npm run build:code`,
        `vitest --run --no-threads related ${filenames.join(' ')}`
    ]
}