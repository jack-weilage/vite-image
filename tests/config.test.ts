import type { PluginConfig } from '../types'

import { parse_plugin_config } from '../src/utils'
import { it, expect } from 'vitest'

it.each([
    { test: true },
    { include: 10 },
    { transformers: [ 'foo', 'bar' ] }
])('does not apply invalid config: %s', async (input) => {
    // This seems to be the best way to match an AggregateError.
    try {
        //@ts-expect-error: The config _should_ be invalid here.
        parse_plugin_config(input)
    } catch (error) {
        if (!(error instanceof AggregateError))
            throw error
        
        expect(error.errors).toMatchSnapshot()
    }
})

it.each([
    undefined,
    {  },
    { include: '**/*' },
    { include: '**/*', exclude: '**/*.jpeg' },
    { 
        transformers: [{
            name: 'noop',
            matcher: () => true,
            transform: (img: any) => img
        }]
    }
])('affects custom imports: %s', async (input) => {
    expect(parse_plugin_config(input as Partial<PluginConfig>)).toMatchSnapshot()
})