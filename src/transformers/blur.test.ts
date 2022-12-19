import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import blur from './blur'

it('applies blur when it should', ({ expect }) => Promise.all([
    // blur=true
    expect(test_transformer({ blur: true }, blur))
        .resolves.toMatchInlineSnapshot('"4ccad1f3d216cd50c1751e2832ed61c6bbaef017"'),
    // blur=1
    expect(test_transformer({ blur: 1 }, blur))
        .resolves.toMatchInlineSnapshot('"5dac7f88d6aa730b1ed328369b4d7be001080993"'),
    // blur=10
    expect(test_transformer({ blur: 10 }, blur))
        .resolves.toMatchInlineSnapshot('"b1a156f1864accf9ed82d4fb6840fbf414b807b7"'),
    // blur=0
    expect(test_transformer({ blur: 0 }, blur))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply blur when it shouldn\'t', ({ expect }) => Promise.all([
    // blur=false
    expect(test_transformer({ blur: false }, blur))
        .resolves.toBe(base_hash),
    // blur=foo
    expect(test_transformer({ blur: 'foo' }, blur))
        .resolves.toBe(base_hash)
]))