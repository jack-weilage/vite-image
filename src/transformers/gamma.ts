import type { Transformer } from '../../types'

import { clamp, is_true_or_number } from '../utils'

export default {
	name: 'gamma',
	matcher: (config) => is_true_or_number(config['gamma']),
	transform: (img, config) => {
		if (config['gamma'] === true) {
			return img.gamma()
		}

		return img.gamma(clamp(config['gamma'], 1, 3))
	},
} satisfies Transformer<'gamma'>
