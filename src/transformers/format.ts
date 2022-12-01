import type { Transformer } from '../../types'

import { INPUT_FORMATS } from '../constants'

export default {
    name: 'format',
    matcher: (config) => INPUT_FORMATS.includes(config['format']!),
    transform: (img, config) => img.toFormat(config['format'])
} as Transformer<'format'>