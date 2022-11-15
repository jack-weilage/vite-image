export default {
    '**/*.ts': (filenames) => filenames
        .map(filename => `tsc ${filename} --target es2022 --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --module esnext --moduleResolution node --strict`)
        .concat([ `pnpm test -- related ${filenames.join(' ')}` ])
}