import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './modulate'

it.each([
    { brightness: 0 }, { brightness: 50 },
    { saturation: 0 }, { saturation: 50 },
    { hue: 0 },        { hue: 50 },
    { lightness: 0 },  { lightness: 50 }
])('applies the transform modulate=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([
    { brightness: true },
    { brightness: true, saturation: 100 },
    { lightness: 'foo' },
    { hue: 0, lightness: 'foo' }
])('doesn\'t apply the transform modulate=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(),
        //@ts-expect-error: Config shouldn't have these values.
        input,
        [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})