import { expect, it } from 'vitest'
import sharp from 'sharp'
import type { FormatEnum } from 'sharp'
import { apply_transformers, create_hash } from '../utils'

import transformer from './format'
const base_image = sharp('./tests/fixtures/images/dog.jpg')
const metadata = await base_image.metadata()

it.each([ 'jpeg', 'webp', 'png' ])('applies the transform format=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { format: input as keyof FormatEnum }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 'foo', true, false, 1, 0 ])('doesn\'t apply the transform format=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { format: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})