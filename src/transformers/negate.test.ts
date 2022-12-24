import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import negate from './negate'

test('applies negate when it should', () => Promise.all([
    // negate=true
    test_transformer({ negate: true }, negate)
        .then(val => assert.is(val, 'f4040a8bcc6c3cbcebca62633c05aaa8fc0959d7')),
    // negate=false
    test_transformer({ negate: false }, negate)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()