import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import format from './format'

test('applies format when it should', () => Promise.all([
    // JPEG (should be same as base image)
    test_transformer({ format: 'jpeg' }, format)
        .then(val => assert.is(val, base_hash)),
    // PNG
    test_transformer({ format: 'png' }, format)
        .then(val => assert.is(val, '08f6793b0df7e4fdc3a9e52166015cb4fb62f8d4'))
]) as unknown as Promise<void>)

test.run()