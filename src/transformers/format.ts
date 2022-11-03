import type { Transformer } from '../../types'
import type { FormatEnum } from 'sharp'

import { includes } from '../utils'
import { INPUT_FORMATS } from '../constants'

export default {
    name: 'format',
    matcher: (config) => includes(INPUT_FORMATS, config['format']),
    transform: (img, config) => img.toFormat(config['format'] as keyof FormatEnum)
} as Transformer