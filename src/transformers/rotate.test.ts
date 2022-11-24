import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './rotate'

it.each([ 0, -45, 90, 540 ])('applies the transform rotate=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { rotate: input as number }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo' ])('doesn\'t apply the transform rotate=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        rotate: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})