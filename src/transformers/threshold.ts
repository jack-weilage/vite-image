import type { Transformer } from '../../types'

import { clamp, is_number } from '../utils'

export default {
	name: 'threshold',
	matcher: (config) => is_number(config['threshold']),
	transform: (img, config) => img.threshold(clamp(config['threshold'], 0, 255)),
} satisfies Transformer<'threshold'>
