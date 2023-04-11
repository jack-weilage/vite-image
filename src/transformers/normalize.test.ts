import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import normalize from './normalize'

test('applies normalize when it should', () =>
	Promise.all([
		// normalize=true
		test_transformer({ normalize: true }, normalize).then((val) =>
			assert.is(val, 'e5254a31b4015abdb0971a859381d750e934b18a'),
		),
		// normalize=false
		test_transformer({ normalize: false }, normalize).then((val) => assert.is(val, base_hash)),
	]) as unknown as Promise<void>)

test.run()
