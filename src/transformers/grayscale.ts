import type { Transformer } from '../../types'

import { is_boolean } from '../utils'

export default {
	name: 'grayscale',
	matcher: (config) => is_boolean(config['grayscale']),
	transform: (img, config) => img.grayscale(config['grayscale']),
} satisfies Transformer<'grayscale'>
