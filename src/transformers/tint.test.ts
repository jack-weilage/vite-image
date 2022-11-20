import { expect, it } from 'vitest'
import { apply_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './tint'

it.each([ '#fff', '#1cd', '#face', '#ffaacc99' ])('applies the transform tint=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { tint: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo', 1, 100 ])('doesn\'t apply the transform tint=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { tint: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})