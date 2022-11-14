import type { FormatEnum } from 'sharp'
import type { PluginConfig } from '../types'

import Schema from 'validate'

export const DEFAULT_CONFIG: PluginConfig = {
    include: '**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*',
    exclude: '',
    deliminator: ',',
    transformers: [],

    default_exports: [ 'src', 'aspect', 'width', 'height', 'format' ],
    post_process: images => images
}

export const INPUT_FORMATS = [ 
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
] as (keyof FormatEnum)[]

export const DEV_PREFIX = '/@image/'
export const BUILD_PREFIX = '__VITE_IMAGE_ASSET__'

export const CONFIG_SCHEMA = new Schema({
    include: { type: String },
    exclude: { type: String },
    deliminator: { type: String },
    transformers: [{
        name: { type: String, required: true },
        matcher: { type: Function, required: true },
        transform: { type: Function, required: true }
    }],
    default_exports: [{ type: String }],
    post_process: { type: Function }
}, { strict: true })