import type { Transformer } from '../../types'

import { does_include } from '../utils'
import { INPUT_FORMATS } from '../constants'

export default {
    name: 'format',
    matcher: (config) => does_include(INPUT_FORMATS, config['format']),
    transform: (img, config) => img.toFormat(config['format'])
} satisfies Transformer<'format'>