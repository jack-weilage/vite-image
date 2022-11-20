import { expect, it } from 'vitest'
import { apply_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './colorspace'
import type { INPUT_COLORSPACES } from '../constants'

it.each([ 'b-w', 'hsv', 'cmyk', 'rgb16' ] as typeof INPUT_COLORSPACES)('applies the transform colorspace=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, { colorspace: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ true, false, 'foo', 'not-a-colorspace', 1, 100 ])('doesn\'t apply the transform colorspace=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, { colorspace: input }, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})