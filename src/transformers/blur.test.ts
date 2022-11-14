import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './blur'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ true, 1, 10, 0 ])('applies the transform blur=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { blur: input as number | true }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform blur=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { blur: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})