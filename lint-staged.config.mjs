export default {
    '**/*.ts': (filenames) => [
        `pnpm build`,
        ...filenames.map(filename => `tsc ${filename} --target es2022 --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --module esnext --moduleResolution node --strict`),
        `pnpm test -- related ${filenames.join(' ')}`
    ]
}