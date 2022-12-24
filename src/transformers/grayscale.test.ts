import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import grayscale from './grayscale'

test('applies grayscale when it should', () => Promise.all([
    // grayscale=true
    test_transformer({ grayscale: true }, grayscale)
        .then(val => assert.is(val, 'a24f3285f39176f75ff2fec442e3d77953c6a282')),
    // grayscale=false
    test_transformer({ grayscale: false }, grayscale)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()