export default {
    '**/*.ts': (filenames) => filenames
        .map(filename => `tsc ${filename}`)
        .concat([ `pnpm test -- related ${filenames.join(' ')}` ])
}