import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import flop from './flop'

test('applies flop when it should', () => Promise.all([
    // flop=true
    test_transformer({ flop: true }, flop)
        .then(val => assert.is(val, '4e72cf92bca07add4843af4298f3ea9f4056de15')),
    // Should be base image.
    test_transformer({ flop: false }, flop)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()