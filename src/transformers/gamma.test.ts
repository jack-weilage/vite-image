import { expect, it } from 'vitest'
import { apply_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './gamma'

it.each([ true, 1, 10, 0 ])('applies the transform gamma=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { gamma: input as number | true }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform gamma=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { gamma: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})