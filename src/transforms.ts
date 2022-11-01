import type { FormatEnum } from 'sharp'
import type { Transformer } from '../types'


import { INPUT_FORMATS } from './constants'
import { includes } from './utils'

export default [
    {
        name: 'resize',
        matcher: (config) => 
            (typeof config['width'] !== 'string' && typeof config['height'] !== 'string') &&
            (config['width'] !== undefined || config['width'] !== undefined),
        transform: (img, config) => img.resize(Math.max(config['width'] ?? 1, 1), Math.max(config['height'] ?? 1, 1))
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