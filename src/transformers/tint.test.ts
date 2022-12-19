import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import tint from './tint'

it('applies tint when it should', ({ expect }) => Promise.all([
    // tint=#fff
    expect(test_transformer({ tint: '#fff' }, tint))
        .resolves.toMatchInlineSnapshot('"68b5575d12c237cb72604fcb87855b37ec6f4f50"'),
    // tint=#1cd
    expect(test_transformer({ tint: '#1cd' }, tint))
        .resolves.toMatchInlineSnapshot('"bc8cf1c075c3027e6a034523a87b918949620829"'),
    // tint=#face
    expect(test_transformer({ tint: '#face' }, tint))
        .resolves.toMatchInlineSnapshot('"d234800e207ab9b807f6836c6e410caa2ec9e071"'),
    // tint=#ffaacc99
    expect(test_transformer({ tint: '#ffaacc99' }, tint))
        .resolves.toMatchInlineSnapshot('"d234800e207ab9b807f6836c6e410caa2ec9e071"')
]))
it('doesn\'t apply tint when it shouldn\'t', ({ expect }) => Promise.all([
    // tint=true
    expect(test_transformer({ tint: true }, tint))
        .resolves.toBe(base_hash),
    // tint=false
    expect(test_transformer({ tint: false }, tint))
        .resolves.toBe(base_hash),
    // tint=foo
    expect(test_transformer({ tint: 'foo' }, tint))
        .resolves.toBe(base_hash),
    // tint=5
    expect(test_transformer({ tint: 5 }, tint))
        .resolves.toBe(base_hash)
]))