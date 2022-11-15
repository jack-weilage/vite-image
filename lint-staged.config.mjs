export default {
    '**/*.ts': (filenames) => filenames
        .map(filename => `tsc -p tsconfig.json ${filename}`)
        .concat([ `pnpm test -- related ${filenames.join(' ')}` ])
}