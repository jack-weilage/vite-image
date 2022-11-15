import type { PluginConfig } from '../types'

import { parse_config } from '../src/utils'
import { DEFAULT_CONFIG } from '../src/constants'
import { it, expect } from 'vitest'

it.each([
    { test: true },
    { include: 10 },
    { transformers: [ 'foo', 'bar' ] }
])('does not apply invalid config: %s', async (input) => {
    // This seems to be the best way to match an AggregateError.
    try {
        //@ts-expect-error: The config _should_ be invalid here.
        parse_config(input, DEFAULT_CONFIG)
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
    expect(parse_config(input as Partial<PluginConfig>, DEFAULT_CONFIG)).toMatchSnapshot()
})