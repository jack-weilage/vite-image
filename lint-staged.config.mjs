const tsconfig = '--target esnext --module esnext --moduleResolution node --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --allowSyntheticDefaultImports --strict --alwaysStrict'

export default {
    //eslint-disable-next-line no-inline-comments -- JSDOC comments are needed to properly type this.
    '**/*.ts': (/** @type string[] */ filenames) => [
        `npm run lint --fix ${filenames.join(' ')}`,
        `concurrently ${filenames
            .map(filename => `"tsc ${filename} ${tsconfig}"`)
            .join(' ')} -m 85%`,
        'npm run build:code',
        `npm run coverage`
    ]
}