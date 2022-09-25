import type { FormatEnum } from 'sharp'

export const FORMATS = [ 
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