import type { Transformer } from '../../types'

import { is_number } from '../utils'

export default {
	name: 'rotate',
	matcher: (config) => is_number(config['rotate']),
	transform: (img, config) => img.rotate(config['rotate']),
} satisfies Transformer<'rotate'>
