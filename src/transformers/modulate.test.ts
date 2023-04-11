import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { test_transformer } from '../../tests/utils'
import modulate from './modulate'

test('applies modulate when it should', () =>
	Promise.all([
		// brightness=50
		test_transformer({ brightness: 50 }, modulate).then((val) =>
			assert.is(val, 'cca391a9d1f8f1e30095c9efc4d06cb2be7ad22f'),
		),
		// saturation=50
		test_transformer({ saturation: 50 }, modulate).then((val) =>
			assert.is(val, '274b6fa0b55114f973ce7fe5ceea202efdb58f68'),
		),
		// hue=50
		test_transformer({ hue: 50 }, modulate).then((val) =>
			assert.is(val, 'a19a0c2a3041089f9e5fd0fec14343af146ef954'),
		),
		// lightness=50
		test_transformer({ lightness: 50 }, modulate).then((val) =>
			assert.is(val, 'c9ca9af78fd7b0ca486997bbe3e58bfbd66cd4c8'),
		),
	]) as unknown as Promise<void>)

test.run()
