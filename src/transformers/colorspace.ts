import type { Transformer } from '../../types'

import { does_include } from '../utils'
import { INPUT_COLORSPACES } from '../constants'

export default {
    name: 'colorspace',
    matcher: (config) => does_include(INPUT_COLORSPACES, config['colorspace']),
    transform: (img, config) => img.toColorspace(config['colorspace'])
} satisfies Transformer<'colorspace'>