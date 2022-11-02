import type { FormatEnum } from 'sharp'
import type { PluginConfig } from '../types'

export const DEFAULT_CONFIG: PluginConfig = {
    include: '**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*',
    exclude: '',
    deliminator: ',',
    transformers: [],

    default_exports: [ 'src', 'aspect', 'width', 'height', 'format' ]
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