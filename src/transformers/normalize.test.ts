import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import normalize from './normalize'

it('applies normalize when it should', ({ expect }) => Promise.all([
    // normalize=true
    expect(test_transformer({ normalize: true }, normalize))
        .resolves.toMatchInlineSnapshot('"e5254a31b4015abdb0971a859381d750e934b18a"'),
    // normalize=false
    expect(test_transformer({ normalize: false }, normalize))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply normalize when it shouldn\'t', ({ expect }) => Promise.all([
    // normalize=foo
    expect(test_transformer({ normalize: 'foo' }, normalize))
        .resolves.toBe(base_hash),
    // normalize=1
    expect(test_transformer({ normalize: 1 }, normalize))
        .resolves.toBe(base_hash),
    // normalize=0
    expect(test_transformer({ normalize: 0 }, normalize))
        .resolves.toBe(base_hash)
]))