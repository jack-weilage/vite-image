import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './flop'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ true, false ])('applies the transform flop=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { flop: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 1, 0 ])('doesn\'t apply the transform flop=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { flop: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})