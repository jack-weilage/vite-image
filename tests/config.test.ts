import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { parse_plugin_config } from '../src/utils'

test("doesn't apply an invalid config", () => {
	assert.throws(
		//@ts-expect-error: The config shouldn't have this key.
		() => parse_plugin_config({ test: true }),
		(err: unknown) => err instanceof Error,
		'Unknown config key',
	)
	assert.throws(
		//@ts-expect-error: The config shouldn't have this value.
		() => parse_plugin_config({ include: 10 }),
		(err: unknown) => err instanceof Error,
		'Config values are of correct type (simple)',
	)
	assert.throws(
		//@ts-expect-error: The config shouldn't have this value in an array.
		() => parse_plugin_config({ transformers: ['foo', 'bar'] }),
		(err: unknown) => err instanceof Error,
		'Config values are of correct type (array)',
	)
})
//TODO: Expand checks for valid config.
test('applies a valid config', () => {
	// Empty config.
	assert.type(parse_plugin_config({}), 'object')
	// Config with custom values.
	assert.type(
		parse_plugin_config({
			include: '**/*',
			exclude: '**/*.jpeg',
			transformers: [
				{
					name: 'noop',
					matcher: () => true,
					transform: (img) => img,
				},
			],
		}),
		'object',
	)
})

test.run()
