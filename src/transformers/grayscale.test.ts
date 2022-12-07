import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './grayscale'

it.each([ true, false ])('applies the transform grayscale=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), { grayscale: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 'foo', 1, 100 ])('doesn\'t apply the transform grayscale=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        grayscale: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})