import type { ImageConfig, Transformer, PluginConfig, ImageConfigValue } from '../types'
import type { Sharp } from 'sharp'
import type { BinaryLike } from 'crypto'

import { createHash } from 'crypto'
import { basename, extname } from 'path'
import { CONFIG_SCHEMA } from './constants'

/** Limit a number to between min and max. */
export const clamp = (num: number, min: number, max: number): number => Math.max(Math.min(num, max), min)

/**
 * Create a SHA1 hash from a string.
 *
 * SHA256 is more secure, but speed matters more here.
*/
export const create_hash = (str: BinaryLike): string => createHash('sha1')
    .update(str)
    .digest('hex')

/** Extract the name of a file, without its extension. */
export const filename = (path: string): string => basename(path, extname(path))

/** Take an iterable object (like an array), and return a deduped array. */
export const dedupe = <T>(arr: Iterable<T> ): T[] => [ ...new Set(arr) ]

/** Create a `Partial` of any object. */
export function create_partial<T extends object>(obj: T, keys: string[]): Partial<T>
{
    const partial: Partial<T> = {}
    // Only include keys which are in the object to avoid random unknown values.
    const keys_in_obj = keys.filter(key => key in obj) as (keyof typeof obj)[]

    // Create the partial.
    for (const key of keys_in_obj)
        partial[key] = obj[key]

    return partial
}

/** Validate and combine a user config and default config. */
export function parse_plugin_config(user_plugin_config: Partial<PluginConfig>): PluginConfig
{
    // Create a copy of the default config, then copy the user's config onto that.
    const parsed = CONFIG_SCHEMA.safeParse(user_plugin_config)

    //TODO: Test this error.
    if (!parsed.success)
        throw new AggregateError([ parsed.error ])

    return parsed.data
}

/** Coerces values to string | number | boolean. */
export function format_value(val: string): ImageConfigValue
{
    if (val === '' || val === 'true')
        return true

    if (val === 'false')
        return false

    if (!Number.isNaN(+val))
        return +val

    return val
    /* c8 ignore next */
}

/** Create unique configs from arrays of values. */
export function create_configs(params: URLSearchParams, deliminator: string): Partial<ImageConfig>[]
{
    const aggregated: Record<string, ImageConfigValue[]> = {}
    for (const param_key of dedupe(params.keys()))
    {
        const is_inverted = param_key.startsWith('!')

        // Get every occurrence of the key, then split by the deliminator.
        // If the key is inverted, invert the values.
        const values = params.getAll(param_key)
            .flatMap(value => value.split(deliminator))
            .map(val => (is_inverted ? !format_value(val) : format_value(val)))

        const key = is_inverted ? param_key.slice(1) : param_key
        // If we haven't used this key before (it's been modified above), then we need to define the value as an array.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        aggregated[key] ??= []
        // If we've already defined the key, just tack the new values on to the end of the old ones.
        aggregated[key] = dedupe(aggregated[key].concat(values))
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
        .reduce((acc, cur) => acc.flatMap(a => cur.map(b => [ a, b ].flat()))) as unknown as ImageConfigValue[][]

    const configs = []
    for (const group of groups)
    {
        const config: Record<string, ImageConfigValue> = {}

        // For every value, assign the corresponding key.
        for (let i = 0; i < keys.length; i++)
            config[keys[i]] = group[i]

        configs.push(config)
    }

    return configs
}

/** Apply all transformers to an image. */
export async function queue_transformers(image: Sharp, config: Partial<ImageConfig>, transformers: Transformer[]):
    Promise<{
        image: Sharp
        queued_transformers: string[]
        errors: AggregateError
    }>
{
    const queued_transformers: string[] = []
    const errors: Error[] = []

    for (const { matcher, transform, name } of transformers)
    {
        /* c8 ignore next 2 */
        if (!await matcher(config))
            continue

        try
        {
            image = await transform(image, config)
            /* c8 ignore next 5 */
        }
        catch (e)
        {
            errors.push(new Error(`vite-image: Transformer "${name}" threw an error: ${(e as Error).message}`))
        }

        queued_transformers.push(name)
    }

    return { image, queued_transformers, errors: new AggregateError(errors) }
}

/** Is the input a boolean? */
export const is_boolean = (input: unknown): boolean => typeof input === 'boolean'
/** Is the input a number? */
export const is_number = (input: unknown): boolean => typeof input === 'number'
/** Is the input true or a number? */
export const is_true_or_number = (input: unknown): boolean => input === true || is_number(input)
/** Does the array include the input? */
export const does_include = (arr: unknown[], input: unknown): boolean => arr.includes(input)