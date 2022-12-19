import { it } from 'vitest'

import { parse_plugin_config } from '../src/utils'

it('doesn\'t apply an invalid config', ({ expect }) => {
    //@ts-expect-error: The config shouldn't have this key.
    expect(() => parse_plugin_config({ test: true }))
        .toThrowError(AggregateError)
    //@ts-expect-error: The config shouldn't have this value.
    expect(() => parse_plugin_config({ include: 10 }))
        .toThrowError(AggregateError)
    //@ts-expect-error: The config shouldn't have this value in an array.
    expect(() => parse_plugin_config({ transformers: [ 'foo', 'bar' ] }))
        .toThrowError(AggregateError)
})
//TODO: Expand checks for valid config.
it.only('applies a valid config', ({ expect }) => {
    // Empty config.
    expect(parse_plugin_config({}))
        .toBeTypeOf('object')
    // Config with custom values.
    expect(parse_plugin_config({
        include: '**/*', exclude: '**/*.jpeg',
        transformers: [{
            name: 'noop',
            matcher: () => true,
            transform: (img) => img
        }]
    }))
        .toBeTypeOf('object')
})