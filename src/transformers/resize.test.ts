import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import resize from './resize'

it('applies resize when it should', ({ expect }) => Promise.all([
    // width=100
    expect(test_transformer({ width: 100 }, resize))
        .resolves.toMatchInlineSnapshot('"9393a7b45b0e2a891ecb65aaa800278ce63135e8"'),
    // height=100
    expect(test_transformer({ height: 100 }, resize))
        .resolves.toMatchInlineSnapshot('"2d037cab519f9d2ef4dc2e2f857fdb871271facf"'),
    // width=100&height=100
    expect(test_transformer({ width: 100, height: 100 }, resize))
        .resolves.toMatchInlineSnapshot('"a8713634c76967a5651c8f6e3341933a4cccfe9e"')
]))
it('doesn\'t apply resize when it shouldn\'t', ({ expect }) => Promise.all([
    // width=false
    expect(test_transformer({ width: false }, resize))
        .resolves.toBe(base_hash),
    // width=100&height=foo
    expect(test_transformer({ height: 'foo' }, resize))
        .resolves.toBe(base_hash),
    // width=foo&height=100
    expect(test_transformer({ width: 'foo', height: true }, resize))
        .resolves.toBe(base_hash)
]))