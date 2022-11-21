import { expect, it } from 'vitest'
import sharp from 'sharp'
import { queue_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './flip'

it.each([ true, false ])('applies the transform flip=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), metadata, { flip: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 1, 0 ])('doesn\'t apply the transform flip=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), metadata, { flip: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})