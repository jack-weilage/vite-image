import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import blur from './blur'

test('applies blur when it should', () => Promise.all([
    // Fast 3x3 blur
    test_transformer({ blur: true }, blur)
        .then(val => assert.is(val, '4ccad1f3d216cd50c1751e2832ed61c6bbaef017')),
    // Normal, medium blur
    test_transformer({ blur: 10 }, blur)
        .then(val => assert.is(val, 'b1a156f1864accf9ed82d4fb6840fbf414b807b7')),
    // Very low value of blur (should be the same as base image)
    test_transformer({ blur: 0 }, blur)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()