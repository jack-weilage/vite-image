import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import gamma from './gamma'

test('applies gamma when it should', () => Promise.all([
    // gamma=true
    test_transformer({ gamma: true }, gamma)
        .then(val => assert.is(val, '5e2a10c8919b9b9ac35a2bb26c5a66d4cb79ef97')),
    // gamma=1
    test_transformer({ gamma: 1 }, gamma)
        .then(val => assert.is(val, base_hash)),
    // gamma=10
    test_transformer({ gamma: 3 }, gamma)
        .then(val => assert.is(val, '67b027232e057968da9a6d9aedbd57c4fd2bb260'))
]) as unknown as Promise<void>)

test.run()