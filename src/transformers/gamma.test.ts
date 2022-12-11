import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './gamma'

it.each([ true, 1, 10, 0 ] satisfies (number | true)[])('applies the transform gamma=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), { gamma: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform gamma=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        gamma: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})