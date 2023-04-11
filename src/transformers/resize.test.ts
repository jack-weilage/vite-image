import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { test_transformer } from '../../tests/utils'
import resize from './resize'

test('applies resize when it should', () =>
	Promise.all([
		// width=100
		test_transformer({ width: 100 }, resize).then((val) =>
			assert.is(val, '9393a7b45b0e2a891ecb65aaa800278ce63135e8'),
		),
		// height=100
		test_transformer({ height: 100 }, resize).then((val) =>
			assert.is(val, '2d037cab519f9d2ef4dc2e2f857fdb871271facf'),
		),
		// width=100&height=100
		test_transformer({ width: 100, height: 100 }, resize).then((val) =>
			assert.is(val, 'a8713634c76967a5651c8f6e3341933a4cccfe9e'),
		),
	]) as unknown as Promise<void>)

test.run()
