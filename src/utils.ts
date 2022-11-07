import type { ImageConfig, Transformer, PluginConfig } from '../types'
import type { Sharp, Metadata } from 'sharp'

import { createHash } from 'crypto'
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

/** Coerces values to string | number | boolean. */
const format_value = (val: string) => {
    if (val === '' || val === 'true')
        return true

    if (val === 'false')
        return false
    
    if (!Number.isNaN(+val))
        return +val

    return val
}

//TODO: Handle `!blur` as `blur=false`
/** Create unique configs from arrays of values. */
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

/** Apply all transformers to an image. */
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