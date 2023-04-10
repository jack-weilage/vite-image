import type { Transformer } from '../../types'

import { is_boolean } from '../utils'

export default {
	name: 'flop',
	matcher: (config) => is_boolean(config['flop']),
	transform: (img, config) => img.flop(config['flop']),
} satisfies Transformer<'flop'>
