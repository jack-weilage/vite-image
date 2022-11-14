import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: process.env.CI ? 45000 : 15000
    }
})