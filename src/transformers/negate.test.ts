import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './negate'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ true, false ])('applies the transform negate=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { negate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 0, 1 ])('doesn\'t apply the transform negate=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { negate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})