const tsconfig = '--target es2022 --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --module esnext --moduleResolution node --allowSyntheticDefaultImports --strict'

export default {
    //eslint-disable-next-line no-inline-comments
    '**/*.ts': (/** @type string[] */ filenames) => [
        `npm run lint ${filenames.join(' ')} --fix`,
        `concurrently ${filenames
            .map(filename => `"tsc ${filename} ${tsconfig}"`)
            .join(' ')} -m 50%`,
        'npm run build:code',
        `vitest --run --no-threads related ${filenames.join(' ')}`
    ]
}