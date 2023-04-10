import type { Transformer } from '../../types'

export default {
	name: 'tint',
	matcher: (config) => typeof config['tint'] === 'string' && config['tint'].startsWith('#'),
	transform: (img, config) => img.tint(config['tint']),
} satisfies Transformer<'tint'>
