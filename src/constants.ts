import type { FormatEnum } from 'sharp'
import type { ColorspaceEnum, PluginConfig } from '../types'

import Schema from 'validate'

export const DEFAULT_PLUGIN_CONFIG: PluginConfig = {
    include: '**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*',
    exclude: '',
    deliminator: ',',
    transformers: [],

    default_exports: [ 'src', 'aspect', 'width', 'height', 'format' ]
}

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

export const CONFIG_SCHEMA = new Schema({
    include: { type: String },
    exclude: { type: String },
    deliminator: { type: String },
    transformers: [{
        name: { type: String, required: true },
        matcher: { type: Function, required: true },
        transform: { type: Function, required: true }
    }],
    default_exports: [{ type: String }]
}, { strict: true })