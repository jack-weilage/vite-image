import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image, base_hash } from '../../tests/utils'
import transformer from './blur'

it.each([ true, 1, 10, 0 ] satisfies (number | true)[])('applies the transform blur=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), { blur: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform blur=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        blur: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})