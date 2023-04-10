import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import threshold from './threshold'

test('applies threshold when it should', () =>
	Promise.all([
		// threshold=128
		test_transformer({ threshold: 128 }, threshold).then((val) =>
			assert.is(val, '83ffe6552fb3fe6b12afc1c9ff0323cabdef3a97'),
		),
		// threshold=0
		test_transformer({ threshold: 0 }, threshold).then((val) => assert.is(val, base_hash)),
	]) as unknown as Promise<void>)

test.run()
