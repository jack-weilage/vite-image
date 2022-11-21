import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './rotate'

it.each([ 0, -45, 90, 540 ])('applies the transform rotate=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), metadata, { rotate: input as number }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo' ])('doesn\'t apply the transform rotate=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), metadata, { rotate: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})