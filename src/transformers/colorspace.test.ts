import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './colorspace'
import type { INPUT_COLORSPACES } from '../constants'

it.each([ 'b-w', 'hsv', 'cmyk', 'rgb16' ] as typeof INPUT_COLORSPACES)('applies the transform colorspace=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), { colorspace: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'error', 1, 100 ])('doesn\'t apply the transform colorspace=%s', async (input) => {
    const { image } = await queue_transformers(base_image.clone(), {
        //@ts-expect-error: Config shouldn't have these values.
        colorspace: input
    }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})