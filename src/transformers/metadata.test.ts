import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import metadata from './metadata'

it('applies metadata when it should', ({ expect }) => Promise.all([
    // metadata=true
    expect(test_transformer({ metadata: true }, metadata))
        .resolves.toMatchInlineSnapshot('"0b95256618bd832e887e1169cacde6e29bee2ac2"'),
    // metadata=false
    expect(test_transformer({ metadata: false }, metadata))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply metadata when it shouldn\'t', ({ expect }) => Promise.all([
    // metadata=foo
    expect(test_transformer({ metadata: 'foo' }, metadata))
        .resolves.toBe(base_hash),
    // metadata=1
    expect(test_transformer({ metadata: 1 }, metadata))
        .resolves.toBe(base_hash),
    // metadata=0
    expect(test_transformer({ metadata: 0 }, metadata))
        .resolves.toBe(base_hash)
]))