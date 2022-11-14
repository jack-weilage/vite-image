import { expect, it } from 'vitest'
import sharp from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './rotate'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ 0, -45, 90, 540 ])('applies the transform rotate=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { rotate: input as number }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo' ])('doesn\'t apply the transform rotate=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { rotate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})