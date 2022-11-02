import { createHash } from 'crypto'
import type { Sharp } from 'sharp'
import type { ImageConfig, Transformer } from '../types'
import { INPUT_FORMATS } from './constants'

import { basename, extname } from 'path'

export const create_hash = (str: string): string => createHash('sha1').update(str).digest('hex')
export const filename = (path: string) => basename(path, extname(path))
// stolen from https://fettblog.eu/typescript-array-includes/
// This is _not_ here because I am wrapping includes. It's here because TypeScript hates includes
export const includes = <T extends U, U>(coll: ReadonlyArray<T>, el: U): el is T => coll.includes(el as T)
export const dedupe = <T>(arr: T[]) => [ ...new Set(arr) ]
export const copy_only_keys = <T>(obj: T, keys: (keyof T)[]) => keys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] }), {} as Partial<T>)

//TODO: Add more parsing logic than just combining the two.
export function parse_config<T>(user_config: Partial<T>, default_config: T): T
{
    return { ...default_config, ...user_config }
}

export function params_to_obj(params: URLSearchParams, deliminator: string): Record<string, string[]>
{
    const obj = {} as Record<string, string[]>
    for (const [ key, value ] of params.entries())
        obj[key] = value.includes(deliminator) ? dedupe(value.split(deliminator)) : [ value ]
    

    return obj
}
const format_value = (val: string) => Number.isNaN(+val) ? val === '' ? true : val : +val

//TODO: fix this insane mess. i... uhhh...
export function create_configs(input: Record<string, string[]>): ImageConfig[]
{
    // I'm going insane. An array is _always_ truthy, just like an object.
    if (Object.keys(input).length === 0)
        return []
    
    // Fix truncated values when only using one key.
    if (Object.keys(input).length === 1)
        // return Object.entries(input)[0].map(([ key, value ]) => ({ [key]: Number.isNaN(+value) ? value === '' ? true : value : +value }))
        return Object.values(input)[0]
            .filter(Boolean)
            .map(value => ({ [Object.keys(input)[0]]: format_value(value) }))
    
    return Object.values(input)
        .filter(Boolean)
        //@ts-expect-error: Still don't get why this errors, but it works...
        .reduce((acc, cur) => acc.flatMap(a => cur.map(b => [ a, b ].flat())))
        .map(values => Object.keys(input).reduce((acc, cur, i) => ({ ...acc, [cur]: format_value(values[i])}), {}))
}

export async function apply_transforms(image: Sharp, config: ImageConfig, transforms: Transformer[])
{
    const metadata = await image.metadata()

    let img = image
    // Used to check if any transformers applied to the image
    let is_transformed = false

    for (const { matcher, transform } of transforms)
    {
        if (!matcher(config))
            continue
    
        is_transformed = true
        img = transform(img, config, metadata)
    }

    return { img, is_transformed }
}


export async function find_lightest(img: Sharp, formats = INPUT_FORMATS)
{
    const buffers = formats.map(format => img.clone().toFormat(format).toBuffer({ resolveWithObject: true }))
    const list = await Promise.all(buffers)

    return list.sort((a, b) => a.info.size - b.info.size)
}