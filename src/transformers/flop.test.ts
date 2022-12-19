import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import flop from './flop'

it('applies flop when it should', ({ expect }) => Promise.all([
    // flop=true
    expect(test_transformer({ flop: true }, flop))
        .resolves.toMatchInlineSnapshot('"4e72cf92bca07add4843af4298f3ea9f4056de15"'),
    // flop=false
    expect(test_transformer({ flop: false }, flop))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply flop when it shouldn\'t', ({ expect }) => Promise.all([
    // flop=foo
    expect(test_transformer({ flop: 'foo' }, flop))
        .resolves.toBe(base_hash),
    // flop=1
    expect(test_transformer({ flop: 1 }, flop))
        .resolves.toBe(base_hash),
    // flop=0
    expect(test_transformer({ flop: 0 }, flop))
        .resolves.toBe(base_hash)
]))