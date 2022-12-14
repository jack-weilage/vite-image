import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: process.env.CI ? 45000 : 15000,
        include: [ '**/*.test.ts', '**/*.test-d.ts' ],
        coverage: {
            enabled: false,
            reporter: [ 'text' ],
            include: [ 'src/**/*' ],
            exclude: [ 'src/transformers/index.ts' ],
            // all: true,
            perFile: true,
            100: true
        }
    }
})