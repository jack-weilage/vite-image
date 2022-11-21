import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_image } from '../../tests/utils'
import transformer from './normalize'

it.each([ true, false ])('applies the transform normalize=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { normalize: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo', 0, 1 ])('doesn\'t apply the transform normalize=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), { normalize: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})