import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import flip from './flip'

test('applies flip when it should', () =>
	Promise.all([
		// flip=true
		test_transformer({ flip: true }, flip).then((val) =>
			assert.is(val, 'a6538e28dd93673aa06cb6198a733ecd37ac16c2'),
		),
		// Should be same as base image.
		test_transformer({ flip: false }, flip).then((val) => assert.is(val, base_hash)),
	]) as unknown as Promise<void>)

test.run()
