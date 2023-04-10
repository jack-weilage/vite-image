import type { Transformer } from '../../types'

import { is_number } from '../utils'

export default {
	name: 'resize',
	// See modulate.ts
	matcher: (config) =>
		is_number(config['width'] ?? config['height']) &&
		(typeof config['width'] === 'number' || typeof config['width'] === 'undefined') &&
		(typeof config['height'] === 'number' || typeof config['height'] === 'undefined'),
	transform: (img, config) => {
		const width = typeof config['width'] === 'number' ? Math.round(Math.max(config['width'], 1)) : undefined
		const height =
			typeof config['height'] === 'number' ? Math.round(Math.max(config['height'], 1)) : undefined

		return img.resize(width, height, width && height ? { fit: 'fill' } : undefined)
	},
} satisfies Transformer<'width' | 'height'>
