import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import threshold from './threshold'

it('applies threshold when it should', ({ expect }) => Promise.all([
    // threshold=true
    expect(test_transformer({ threshold: true }, threshold))
        .resolves.toMatchInlineSnapshot('"83ffe6552fb3fe6b12afc1c9ff0323cabdef3a97"'),
    // threshold=1
    expect(test_transformer({ threshold: 1 }, threshold))
        .resolves.toMatchInlineSnapshot('"2c279fde3f316665338dcf0f855f6adf6a6fe5f6"'),
    // threshold=10
    expect(test_transformer({ threshold: 10 }, threshold))
        .resolves.toMatchInlineSnapshot('"ac347695c3cf9d2de50550db9d6dc8e9c26eafb8"'),
    // threshold=0
    expect(test_transformer({ threshold: 0 }, threshold))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply threshold when it shouldn\'t', ({ expect }) => Promise.all([
    // threshold=false
    expect(test_transformer({ threshold: false }, threshold))
        .resolves.toBe(base_hash),
    // threshold=foo
    expect(test_transformer({ threshold: 'foo' }, threshold))
        .resolves.toBe(base_hash)
]))