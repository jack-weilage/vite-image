import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './threshold'

it.each([ true, 1, 10, 0 ])('applies the transform threshold=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), { threshold: input as number | true }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform threshold=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        threshold: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})