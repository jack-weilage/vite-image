import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import grayscale from './grayscale'

it('applies grayscale when it should', ({ expect }) => Promise.all([
    // grayscale=true
    expect(test_transformer({ grayscale: true }, grayscale))
        .resolves.toMatchInlineSnapshot('"a24f3285f39176f75ff2fec442e3d77953c6a282"'),
    // grayscale=false
    expect(test_transformer({ grayscale: false }, grayscale))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply grayscale when it shouldn\'t', ({ expect }) => Promise.all([
    // grayscale=foo
    expect(test_transformer({ grayscale: 'foo' }, grayscale))
        .resolves.toBe(base_hash),
    // grayscale=1
    expect(test_transformer({ grayscale: 1 }, grayscale))
        .resolves.toBe(base_hash),
    // grayscale=0
    expect(test_transformer({ grayscale: 0 }, grayscale))
        .resolves.toBe(base_hash)
]))