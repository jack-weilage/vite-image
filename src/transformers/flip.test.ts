import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './flip'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ true, false ])('applies the transform flip=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { flip: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 1, 0 ])('doesn\'t apply the transform flip=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { flip: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})