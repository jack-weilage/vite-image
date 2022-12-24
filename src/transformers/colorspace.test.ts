import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import colorspace from './colorspace'

test('applies colorspace when it should', () => Promise.all([
    // Black and white
    test_transformer({ colorspace: 'b-w' }, colorspace)
        .then(val => assert.is(val, 'e237b47bfefaa14a99ad83857354ab95c4e80461')),
    // HSV
    test_transformer({ colorspace: 'hsv' }, colorspace)
        .then(val => assert.is(val, '5045f81cf2091c95f76329a05dcbaf71b13af507')),
    // CMYK
    test_transformer({ colorspace: 'cmyk' }, colorspace)
        .then(val => assert.is(val, 'e8c8d84b019a44429a3f437ee4fa065b46b6090d')),
    // RGB16 (should be same as base image)
    test_transformer({ colorspace: 'rgb16' }, colorspace)
        .then(val => assert.is(val, base_hash))
]) as unknown as Promise<void>)

test.run()