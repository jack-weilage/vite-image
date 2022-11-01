import type { Sharp, FormatEnum } from 'sharp'
import type { Transformer } from '../types'


import { INPUT_FORMATS } from './constants'
import { includes } from './utils'


const resize = (img: Sharp, width: number, height: number) => img.resize(Math.round(Math.max(width, 1)), Math.round(Math.max(height, 1)))

export default [
    {
        name: 'resize',
        matcher: (config) => {
            const { width, height } = config

            const width_valid = typeof width === 'number' && !isNaN(width)
            const height_valid = typeof height === 'number' && !isNaN(height)

            return width_valid && height_valid ||       // Both width and height are supplied
                width_valid && height === undefined ||  // Only width is supplied
                width === undefined && height_valid     // Only height is supplied
        },
        transform: (img, config, metadata) => {
            const { width, height } = config

            // Check this first as we don't need metadata.
            if (width !== undefined && height !== undefined)
                return resize(img, width, height)

            // Everything after this will need metadata width/height
            if (!metadata.width || !metadata.height)
                return
            
            
            if (width && height === undefined)
                return resize(img, width, width / metadata.width * metadata.height)

            if (width === undefined && height)
                return resize(img, height / metadata.height * metadata.width, height)
                
            throw new Error('This shouldn\'t happen. How did you get here?')
        }
    },
    {
        name: 'format',
        matcher: (config) => includes(INPUT_FORMATS, config['format']),
        transform: (img, config) => img.toFormat(config['format'] as keyof FormatEnum)
    },
    {
        name: 'blur',
        matcher: (config) => config['blur'] === true || typeof config['blur'] === 'number',
        transform: (img, config) => img.blur(config['blur'] === true ? 0.3 : Math.max(config['blur'] as number, 0.3))
    }
] as Transformer[]