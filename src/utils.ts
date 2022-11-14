import type { ImageConfig, Transformer, PluginConfig } from '../types'
import type { Sharp, Metadata } from 'sharp'

import { type BinaryLike, createHash } from 'crypto'
import { basename, extname } from 'path'
import { CONFIG_SCHEMA } from './constants'

/** Limit a number to between min and max. */
export const minmax = (num: number, min: number, max: number) => Math.max(Math.min(num, max), min)
/** 
 * Create a SHA1 hash from a string.
 * 
 * SHA256 is more secure, but speed matters more here.
*/
export const create_hash = (str: BinaryLike): string => createHash('sha1').update(str).digest('hex')
/** Extract the name of a file, without its extension. */
export const filename = (path: string) => basename(path, extname(path))
/** De-duplicate an array. */
export const dedupe = <T>(arr: T[]) => [ ...new Set(arr) ]

/** Create a `Partial` of any object. */
export function copy_only_keys<T>(obj: T, keys: (keyof T)[]): Partial<T> {
    const partial = {} as Partial<T>
    for (const key of keys)
        partial[key] = obj[key]

    return partial
}

/** Validate and combine a user config and default config. */
export function parse_config(user_config: Partial<PluginConfig>, default_config: PluginConfig): PluginConfig
{
    const config = Object.assign({ ...default_config }, user_config)

    const errors = CONFIG_SCHEMA.validate(config)
    if (errors.length !== 0)
        throw new AggregateError(errors)
    
    return config
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
            .flatMap(value => value.split(deliminator))
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
export function apply_transformers(image: Sharp, metadata: Metadata, config: ImageConfig, transformers: Transformer[])
{
    const applied_transformers = []

    for (const { matcher, transform, name } of transformers)
    {
        if (!matcher(config))
            continue
    
        applied_transformers.push(name)
        image = transform(image, config, metadata)
    }

    return { image, applied_transformers }
}