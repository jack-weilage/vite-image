import { expect, it } from 'vitest'
import type { FormatEnum } from 'sharp'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './format'

it.each([ 'jpeg', 'webp', 'png' ])('applies the transform format=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), { format: input as keyof FormatEnum }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 'foo', true, false, 1, 0 ])('doesn\'t apply the transform format=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), { format: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})