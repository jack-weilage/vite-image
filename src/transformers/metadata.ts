import type { Transformer } from '../../types'

import { is_boolean } from '../utils'

export default {
	name: 'metadata',
	matcher: (config) => is_boolean(config['metadata']),
	transform: (img, config) => (config['metadata'] ? img.withMetadata() : img),
} satisfies Transformer<'metadata'>
