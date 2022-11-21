export default {
    '**/*.ts': (filenames) => [
        filenames
            .map(filename => `bash -c "tsc ${filename} --target es2022 --noErrorTruncation --skipLibCheck --importsNotUsedAsValues error --noEmit --module esnext --moduleResolution node --allowSyntheticDefaultImports --strict"`)
            .join(' & '),
        `pnpm build`,
        `vitest --run --no-threads related ${filenames.join(' ')}`
    ]
}