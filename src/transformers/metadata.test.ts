import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image } from '../../tests/utils'
import transformer from './metadata'

it.each([ true, false ])('applies the transform metadata=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { metadata: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 'foo', 1, 0 ])('doesn\'t apply the transform metadata=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), { metadata: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})