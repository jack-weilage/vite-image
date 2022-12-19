import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import rotate from './rotate'

it('applies rotate when it should', ({ expect }) => Promise.all([
    // rotate=0
    expect(test_transformer({ rotate: 0 }, rotate))
        .resolves.toBe(base_hash),
    // rotate=-45
    expect(test_transformer({ rotate: -45 }, rotate))
        .resolves.toMatchInlineSnapshot('"dccdf9993b120871ae37fdfab55646ed5d827fc0"'),
    // rotate=90
    expect(test_transformer({ rotate: 90 }, rotate))
        .resolves.toMatchInlineSnapshot('"0dca21e67e24388916e851a4e204e11521340e46"'),
    // rotate=540
    expect(test_transformer({ rotate: 540 }, rotate))
        .resolves.toMatchInlineSnapshot('"00412de9a40325052779677e056d2568e2593b37"')
]))
it('doesn\'t apply rotate when it shouldn\'t', ({ expect }) => Promise.all([
    // rotate=true
    expect(test_transformer({ rotate: true }, rotate))
        .resolves.toBe(base_hash),
    // rotate=false
    expect(test_transformer({ rotate: false }, rotate))
        .resolves.toBe(base_hash),
    // rotate=foo
    expect(test_transformer({ rotate: 'foo' }, rotate))
        .resolves.toBe(base_hash)
]))