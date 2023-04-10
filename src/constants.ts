import type { FormatEnum, Sharp } from 'sharp'
import type { ColorspaceEnum } from '../types'

import { z } from 'zod'

export const INPUT_FORMATS: (keyof FormatEnum)[] = [
    'avif',
    'dz',
    'fits',
    'gif',
    'heif',
    'input',
    'jpeg',
    'jpg',
    'magick',
    'openslide',
    'pdf',
    'png',
    'ppm',
    'raw',
    'svg',
    'tif',
    'tiff',
    'v',
    'webp'
]

/** @see https://github.com/libvips/libvips/blob/41cff4e9d0838498487a00623462204eb10ee5b8/libvips/iofuncs/enumtypes.c#L776-L796 */
export const INPUT_COLORSPACES: (keyof typeof ColorspaceEnum)[] = [
    // 'error',
    // 'multiband',
    'b-w',
    'histogram',
    'xyz',
    'lab',
    'cmyk',
    'labq',
    'rgb',
    'cmc',
    'lch',
    'labs',
    'srgb',
    'yxy',
    'fourier',
    'rgb16',
    'grey16',
    'matrix',
    'scrgb',
    'hsv'
    // 'last'
]

/* c8 ignore next 4 */
export const DEV_PREFIX = '/@image/'
export const DEV_REGEX = new RegExp(`^${DEV_PREFIX}([a-z0-9]{40})$`)
export const BUILD_PREFIX = '__VITE_IMAGE_ASSET__'
export const BUILD_REGEX = new RegExp(`${BUILD_PREFIX}([a-z0-9]{8})`, 'g')

export const CONFIG_SCHEMA = z.object({
    include: z.string({ invalid_type_error: 'config.include must be a glob pattern string' }).default('**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*'),
    exclude: z.string({ invalid_type_error: 'config.exclude must be a glob pattern string' }).default(''),
    deliminator: z.string({ invalid_type_error: 'config.delimator must be a string' }).default(','),
    transformers: z.array(
        z.object({
            name: z.string(),
            matcher: z.function()
                .returns(z.union([
                    z.boolean(),
                    z.promise(z.boolean())
                ])),
            transform: z.function()
                .returns(z.union([
                    z.unknown(),
                    z.promise(z.unknown())
                ]).transform(val => val as Sharp))
        })
    ).default([]),
    default_exports: z.array(z.string({ invalid_type_error: 'config.default_exports[n] must be a string' }), { invalid_type_error: 'config.default_exports must be an array' }).default([ 'src', 'aspect', 'width', 'height', 'format' ])
}).strict()