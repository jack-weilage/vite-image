import { expect, it } from 'vitest'
import { apply_transformers, create_hash } from '../utils'

import { base_image, metadata } from '../../tests/utils'
import transformer from './resize'

it.each([ { width: 100 }, { height: 100 }, { width: 100, height: 100 } ])('applies the transform resize=%s', async (input) => {
    const { image } = apply_transformers(base_image.clone(), metadata, input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 
    { width: false }, 
    { height: false }, 
    { width: 100, height: 'foo' }, 
    { width: 'foo', height: 100 } 
])('doesn\'t apply the transform resize=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = apply_transformers(base_image.clone(), metadata, input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})