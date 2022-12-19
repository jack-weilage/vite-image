import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import negate from './negate'

it('applies negate when it should', ({ expect }) => Promise.all([
    // negate=true
    expect(test_transformer({ negate: true }, negate))
        .resolves.toMatchInlineSnapshot('"f4040a8bcc6c3cbcebca62633c05aaa8fc0959d7"')
]))
it('doesn\'t apply negate when it shouldn\'t', ({ expect }) => Promise.all([
    // negate=false
    expect(test_transformer({ negate: false }, negate))
        .resolves.toBe(base_hash),
    // negate=foo
    expect(test_transformer({ negate: 'foo' }, negate))
        .resolves.toBe(base_hash),
    // negate=1
    expect(test_transformer({ negate: 1 }, negate))
        .resolves.toBe(base_hash),
    // negate=0
    expect(test_transformer({ negate: 0 }, negate))
        .resolves.toBe(base_hash)
]))