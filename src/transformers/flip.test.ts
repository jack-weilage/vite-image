import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import flip from './flip'

it('applies flip when it should', ({ expect }) => Promise.all([
    // flip=true
    expect(test_transformer({ flip: true }, flip))
        .resolves.toMatchInlineSnapshot('"a6538e28dd93673aa06cb6198a733ecd37ac16c2"'),
    // flip=false
    expect(test_transformer({ flip: false }, flip))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply flip when it shouldn\'t', ({ expect }) => Promise.all([
    // flip=foo
    expect(test_transformer({ flip: 'foo' }, flip))
        .resolves.toBe(base_hash),
    // flip=1
    expect(test_transformer({ flip: 1 }, flip))
        .resolves.toBe(base_hash),
    // flip=0
    expect(test_transformer({ flip: 0 }, flip))
        .resolves.toBe(base_hash)
]))