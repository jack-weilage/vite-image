import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: process.env.CI ? 45000 : 15000,
        include: [ '**/*.test.ts', '**/*.test-d.ts' ],
        coverage: {
            enabled: true,
            reporter: [ 'json-summary', 'text' ],
            reportsDirectory: 'tests/coverage',
            include: [ 'src/**/*' ],
            exclude: [ 'src/transformers/index.ts' ],
            // all: true,
            skipFull: true,
            perFile: true
        }
    }
})