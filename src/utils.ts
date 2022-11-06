import { createHash } from 'crypto'
import type { Sharp, Metadata } from 'sharp'
import type { ImageConfig, Transformer, PluginConfig } from '../types'
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
export function parse_config(user_config: Partial<PluginConfig>, default_config: PluginConfig): PluginConfig
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
const format_value = (val: string) => {
    if (val === undefined || val === '' || val === 'true')
        return true

    if (val === 'false')
        return false
    
    if (!Number.isNaN(+val))
        return +val

    return val
}

export function create_configs(params: URLSearchParams, deliminator: string): ImageConfig[]
{
    const aggregated = {} as Record<string, (string | number | boolean)[]>
    for (const key of dedupe([ ...params.keys() ]))
    {
        // Get every occurrence of the key, then split by the deliminator.
        const values = params.getAll(key)
            .reduce((acc, cur) => [ ...acc, ...cur.split(deliminator) ], [] as string[])
            .map(format_value)

        aggregated[key] = dedupe(values)
    }
    
    const keys = Object.keys(aggregated)
    const values = Object.values(aggregated)

    // If there is only one key, the code below won't work.
    if (keys.length === 1)
        return values[0].map(value => ({ [keys[0]]: value }))
    
    // Create an array of unique configs.
    // Each value will have the index of the corresponding keys.
    const groups = values
        //@ts-expect-error: This reducer will take in (string | number | boolean)[] and return (string | number | boolean)[][]
        .reduce((acc, cur) => acc.flatMap(a => cur.map(b => [ a, b ].flat()))) as any as (string | number | boolean)[][]
    
    const configs = [] as ImageConfig[]
    for (const group of groups) {
        const config = {} as Record<string, string | number | boolean>

        // For every value, assign the corresponding key.
        for (let i = 0; i < keys.length; i++)
            config[keys[i]] = group[i]
        
        configs.push(config)
    }

    return configs
}

export function apply_transformers(image: Sharp, metadata: Metadata, config: ImageConfig, transforms: Transformer[])
{
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