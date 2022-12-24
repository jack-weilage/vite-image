import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { parse_plugin_config } from '../src/utils'

test('doesn\'t apply an invalid config', () => {
    //@ts-expect-error: The config shouldn't have this key.
    assert.throws(() => parse_plugin_config({ test: true }), err => err instanceof AggregateError)
    //@ts-expect-error: The config shouldn't have this value.
    assert.throws(() => parse_plugin_config({ include: 10 }), err => err instanceof AggregateError)
    //@ts-expect-error: The config shouldn't have this value in an array.
    assert.throws(() => parse_plugin_config({ transformers: [ 'foo', 'bar' ] }), err => err instanceof AggregateError)
})
//TODO: Expand checks for valid config.
test('applies a valid config', () => {
    // Empty config.
    assert.type(parse_plugin_config({}), 'object')
    // Config with custom values.
    assert.type(parse_plugin_config({
        include: '**/*', exclude: '**/*.jpeg',
        transformers: [{
            name: 'noop',
            matcher: () => true,
            transform: (img) => img
        }]
    }), 'object')
})

test.run()