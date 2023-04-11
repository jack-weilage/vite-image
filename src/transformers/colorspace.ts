import type { Transformer } from '../../types'

import { INPUT_COLORSPACES } from '../constants'
import { does_include } from '../utils'

export default {
	name: 'colorspace',
	matcher: (config) => does_include(INPUT_COLORSPACES, config['colorspace']),
	transform: (img, config) => img.toColorspace(config['colorspace']),
} satisfies Transformer<'colorspace'>
