import type { Transformer } from '../../types'
import type { FormatEnum } from 'sharp'

import { INPUT_FORMATS } from '../constants'

export default {
    name: 'format',
    matcher: (config) => INPUT_FORMATS.includes(config['format'] as keyof FormatEnum),
    transform: (img, config) => img.toFormat(config['format'])
} as Transformer<'format'>