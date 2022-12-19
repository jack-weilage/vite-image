import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import gamma from './gamma'

it('applies gamma when it should', ({ expect }) => Promise.all([
    // gamma=true
    expect(test_transformer({ gamma: true }, gamma))
        .resolves.toMatchInlineSnapshot('"5e2a10c8919b9b9ac35a2bb26c5a66d4cb79ef97"'),
    // gamma=1
    expect(test_transformer({ gamma: 1 }, gamma))
        .resolves.toBe(base_hash),
    // gamma=10
    expect(test_transformer({ gamma: 3 }, gamma))
        .resolves.toMatchInlineSnapshot('"67b027232e057968da9a6d9aedbd57c4fd2bb260"')
]))
it('doesn\'t apply gamma when it shouldn\'t', ({ expect }) => Promise.all([
    // gamma=false
    expect(test_transformer({ gamma: false }, gamma))
        .resolves.toBe(base_hash),
    // gamma=foo
    expect(test_transformer({ gamma: 'foo' }, gamma))
        .resolves.toBe(base_hash)
]))