import type { Transformer } from '../../types'

import { INPUT_FORMATS } from '../constants'
import { does_include } from '../utils'

export default {
	name: 'format',
	matcher: (config) => does_include(INPUT_FORMATS, config['format']),
	transform: (img, config) => img.toFormat(config['format']),
} satisfies Transformer<'format'>
