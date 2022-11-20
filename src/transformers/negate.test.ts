import { expect, it } from 'vitest'
import { apply_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './negate'

it.each([ true, false ])('applies the transform negate=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { negate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 0, 1 ])('doesn\'t apply the transform negate=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { negate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})