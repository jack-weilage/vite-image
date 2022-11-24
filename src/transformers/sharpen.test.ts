import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './sharpen'

it.each([ true, 1, 10, 0 ])('applies the transform sharpen=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { sharpen: input as number | true }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ false, 'foo' ])('doesn\'t apply the transform sharpen=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), { sharpen: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})