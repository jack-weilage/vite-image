import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image } from '../../tests/utils'
import transformer from './median'

it.each([ true, 1, 10, 0 ])('applies the transform median=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { median: input as number | true }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform median=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), { median: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})