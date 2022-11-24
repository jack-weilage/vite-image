import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './tint'

it.each([ '#fff', '#1cd', '#face', '#ffaacc99' ])('applies the transform tint=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { tint: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo', 1, 100 ])('doesn\'t apply the transform tint=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        tint: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})