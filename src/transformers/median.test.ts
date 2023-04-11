import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import median from './median'

test('applies median when it should', () =>
	Promise.all([
		// median=true
		test_transformer({ median: true }, median).then((val) =>
			assert.is(val, '51daa445b919e0977701074593041add2b01fd78'),
		),
		// median=1
		test_transformer({ median: 1 }, median).then((val) => assert.is(val, base_hash)),
		// median=10
		test_transformer({ median: 10 }, median).then((val) =>
			assert.is(val, 'ba11a24e0dda9540deb5cbcc929d716fc87864c9'),
		),
	]) as unknown as Promise<void>)

test.run()
