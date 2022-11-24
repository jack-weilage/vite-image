import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './negate'

it.each([ true, false ])('applies the transform negate=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { negate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 'foo', 0, 1 ])('doesn\'t apply the transform negate=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        negate: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})