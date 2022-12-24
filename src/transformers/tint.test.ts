import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { test_transformer } from '../../tests/utils'
import tint from './tint'

test('applies tint when it should', () => Promise.all([
    // tint=#1cd
    test_transformer({ tint: '#1cd' }, tint)
        .then(val => assert.is(val, 'bc8cf1c075c3027e6a034523a87b918949620829')),
    // tint=#face
    test_transformer({ tint: '#face' }, tint)
        .then(val => assert.is(val, 'd234800e207ab9b807f6836c6e410caa2ec9e071')),
    // tint=#ffaacc99
    test_transformer({ tint: '#ffaacc99' }, tint)
        .then(val => assert.is(val, 'd234800e207ab9b807f6836c6e410caa2ec9e071'))
]) as unknown as Promise<void>)

test.run()