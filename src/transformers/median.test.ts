import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import median from './median'

it('applies median when it should', ({ expect }) => Promise.all([
    // median=true
    expect(test_transformer({ median: true }, median))
        .resolves.toMatchInlineSnapshot('"51daa445b919e0977701074593041add2b01fd78"'),
    // median=1
    expect(test_transformer({ median: 1 }, median))
        .resolves.toBe(base_hash),
    // median=10
    expect(test_transformer({ median: 10 }, median))
        .resolves.toMatchInlineSnapshot('"ba11a24e0dda9540deb5cbcc929d716fc87864c9"')
]))
it('doesn\'t apply median when it shouldn\'t', ({ expect }) => Promise.all([
    // median=false
    expect(test_transformer({ median: false }, median))
        .resolves.toBe(base_hash),
    // median=foo
    expect(test_transformer({ median: 'foo' }, median))
        .resolves.toBe(base_hash)
]))