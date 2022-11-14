import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './modulate'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ 
    { brightness: 0 }, { brightness: 50 },
    { saturation: 0 }, { saturation: 50 },
    { hue: 0 },        { hue: 50 },
    { lightness: 0 },  { lightness: 50 }    
])('applies the transform modulate=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([
    { brightness: true },
    { brightness: true, saturation: 100 },
    { lightness: 'foo' },
    { hue: 0, lightness: 'foo' }
])('doesn\'t apply the transform modulate=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})