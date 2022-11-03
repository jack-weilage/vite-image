import type { Sharp, FormatEnum } from 'sharp'
import type { Transformer } from '../types'


import { INPUT_FORMATS } from './constants'
import { includes } from './utils'


const resize = (img: Sharp, width: number, height: number) => 
    img.resize(Math.round(Math.max(width, 1)), Math.round(Math.max(height, 1)), { fit: 'fill' })

export default [
    // Output
    {
        name: 'format',
        matcher: (config) => includes(INPUT_FORMATS, config['format']),
        transform: (img, config) => img.toFormat(config['format'] as keyof FormatEnum)
    },
    // Resize
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
    // Image Operations
    {
        name: 'rotate',
        matcher: (config) => typeof config['rotate'] === 'number',
        transform: (img, config) => img.rotate(config['rotate'])
    },
    {
        name: 'flip',
        matcher: (config) => typeof config['flip'] === 'boolean',
        transform: (img, config) => img.flip(config['flip'])
    },
    {
        name: 'flop',
        matcher: (config) => typeof config['flop'] === 'boolean',
        transform: (img, config) => img.flop(config['flop'])
    },
    {
        name: 'sharpen',
        matcher: (config) => config['sharpen'] === true || typeof config['sharpen'] === 'number',
        transform: (img, config) => img.sharpen(config['sharpen'] === true ? undefined : { sigma: config['sharpen'] as number })
    },
    {
        name: 'median',
        matcher: (config) => config['median'] === true || typeof config['sharpen'] === 'number',
        transform: (img, config) => img.median(config['median'] === true ? undefined : config['median'])
    },
    {
        name: 'blur',
        matcher: (config) => config['blur'] === true || typeof config['blur'] === 'number',
        transform: (img, config) => img.blur(config['blur'] === true ? undefined : Math.max(config['blur'] as number, 0.3))
    },
    {
        name: 'gamma',
        matcher: (config) => config['gamma'] === true || typeof config['gamma'] === 'number',
        transform: (img, config) => img.gamma(config['gamma'] === true ? undefined : Math.min(Math.max(config['gamma'] as number, 1), 3))
    },
    {
        name: 'negate',
        matcher: (config) => typeof config['negate'] === 'boolean',
        transform: (img, config) => img.negate(config['negate'])
    },
    {
        name: 'normalize',
        matcher: (config) => typeof config['normalize'] === 'boolean',
        transform: (img, config) => img.normalize(config['normalize'])
    },
    {
        name: 'threshold',
        matcher: (config) => config['threshold'] === true || typeof config['threshold'] === 'number',
        transform: (img, config) => img.threshold(config['threshold'] === true ? undefined : Math.min(Math.max(config['threshold'] as number, 0), 255))
    },
    {
        name: 'modulate',
        // Ugly ugly ugly. All options are either undefined or number, but at least one option must be number.
        matcher: (config) => (typeof config['brightness'] === 'undefined' || typeof config['brightness'] === 'number')
        && (typeof config['saturation'] === 'undefined' || typeof config['saturation'] === 'number')
        && (typeof config['hue'] === 'undefined' || typeof config['hue'] === 'number')
        && (typeof config['lightness'] === 'undefined' || typeof config['lightness'] === 'number')
        && ((typeof config['brightness'] ?? config['saturation'] ?? config['hue'] ?? config['lightness']) === 'number'),
        transform: (img, config) => img.modulate({
            brightness: config['brightness'],
            saturation: config['saturation'],
            hue: config['hue'],
            lightness: config['lightness']
        })
    }
] as Transformer[]