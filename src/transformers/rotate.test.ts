import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import rotate from './rotate'

test('applies rotate when it should', () =>
	Promise.all([
		// rotate=0
		test_transformer({ rotate: 0 }, rotate).then((val) => assert.is(val, base_hash)),
		// rotate=-45
		test_transformer({ rotate: -45 }, rotate).then((val) =>
			assert.is(val, 'dccdf9993b120871ae37fdfab55646ed5d827fc0'),
		),
		// rotate=90
		test_transformer({ rotate: 90 }, rotate).then((val) =>
			assert.is(val, '0dca21e67e24388916e851a4e204e11521340e46'),
		),
		// rotate=540
		test_transformer({ rotate: 540 }, rotate).then((val) =>
			assert.is(val, '00412de9a40325052779677e056d2568e2593b37'),
		),
	]) as unknown as Promise<void>)

test.run()
