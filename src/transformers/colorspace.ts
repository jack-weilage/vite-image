import type { Transformer } from '../../types'

import { INPUT_COLORSPACES } from '../constants'

export default {
    name: 'colorspace',
    matcher: (config) => INPUT_COLORSPACES.includes(config['colorspace']!),
    transform: (img, config) => img.toColorspace(config['colorspace'])
} satisfies Transformer<'colorspace'>