import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { base_hash, test_transformer } from '../../tests/utils'
import sharpen from './sharpen'

test('applies sharpen when it should', () =>
	Promise.all([
		// sharpen=true
		test_transformer({ sharpen: true }, sharpen).then((val) =>
			assert.is(val, 'aa2fd5583a0ec2f10a9b3f5411b63f6f8aba913f'),
		),
		// sharpen=10
		test_transformer({ sharpen: 10 }, sharpen).then((val) =>
			assert.is(val, 'ff93e49652e1edc65c585d070998f2eb4c09da82'),
		),
		// sharpen=0
		test_transformer({ sharpen: 0 }, sharpen).then((val) => assert.is(val, base_hash)),
	]) as unknown as Promise<void>)

test.run()
