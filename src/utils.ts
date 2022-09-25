import type { Sharp, FormatEnum } from 'sharp'
import { FORMATS } from './constants'
import { createHash } from 'crypto'

import { basename, extname } from 'path'

export const create_hash = (str: string): string => createHash('sha1').update(str).digest('hex')
export const filename = (path: string) => basename(path, extname(path))

export function params_to_obj(params: URLSearchParams): Record<string, string[]>
{
    const obj = {} as Record<string, string[]>
    for (const [ key, value ] of params.entries())
        obj[key] = value.includes(',') ? [ ...new Set(value.split(',')) ] : [ value ] 

    return obj
}

//TODO: fix this insane mess. i... uhhh...
export function create_configs(input: Record<string, string[]>): Record<string, string | number>[]
{
    // Fix truncated values whewn only using one key.
    if (Object.keys(input).length === 1)
        return Object.values(input)[0].map(value => ({ [Object.keys(input)[0]]: value }))
    
    return Object.values(input)
        //@ts-expect-error
        .reduce((acc, cur) => acc.flatMap(a => cur.map(b => [ a, b ].flat())))
        .map(values => Object.keys(input).reduce((acc, cur, i) => ({ ...acc, [cur]: Number.isNaN(Number(values[i])) ? values[i] : Number(values[i])}), {}))
}


export async function find_lightest(img: Sharp, formats = FORMATS)
{
    const buffers = formats.map(format => img.clone().toFormat(format).toBuffer({ resolveWithObject: true }))
    const list = await Promise.all(buffers)

    return list.sort((a, b) => a.info.size - b.info.size)
}