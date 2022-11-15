export default {
    '**/*.ts': (filenames) => filenames
        .map(filename => `tsc ${filename} --noEmit`)
        .concat([ `pnpm test -- related ${filenames.join(' ')}` ])
}