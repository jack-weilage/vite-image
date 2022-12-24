import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import metadata from './metadata'

test('applies metadata when it should', () => Promise.all([
    // metadata=true
    test_transformer({ metadata: true }, metadata)
        .then(val => assert.is(val, '0b95256618bd832e887e1169cacde6e29bee2ac2')),
    // metadata=false
    test_transformer({ metadata: false }, metadata)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()