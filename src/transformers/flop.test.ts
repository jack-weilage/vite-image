import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './flop'

it.each([ true, false ])('applies the transform flop=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), metadata, { flop: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 1, 0 ])('doesn\'t apply the transform flop=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), metadata, { flop: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})