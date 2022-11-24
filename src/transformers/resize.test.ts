import { expect, it } from 'vitest'
import { queue_transformers, create_hash } from '../utils'

import { base_hash, base_image } from '../../tests/utils'
import transformer from './resize'

it.each([ { width: 100 }, { height: 100 }, { width: 100, height: 100 } ])('applies the transform resize=%s', async (input) => {
    const { image } = queue_transformers(base_image.clone(), input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toMatchSnapshot()
})

it.each([ 
    { width: false }, 
    { height: false }, 
    { width: 100, height: 'foo' }, 
    { width: 'foo', height: 100 } 
])('doesn\'t apply the transform resize=%s', async (input) => {
    //@ts-expect-error: Config shouldn't have these values.
    const { image } = queue_transformers(base_image.clone(), input, [ transformer ])

    expect(create_hash(await image.toBuffer())).toBe(base_hash)
})