import type { Transformer } from '../../types'

import { is_number } from '../utils'
//TODO: Create custom option here.
export default {
	name: 'modulate',
	// Surprisingly simple.
	// First, make sure that at least _one_ of the options is a number.
	// Then make sure that _every_ option is either a number or undefined.
	// This will skip checking _every_ option if a single option isn't valid.
	matcher: (config) =>
		is_number(config['brightness'] ?? config['saturation'] ?? config['hue'] ?? config['lightness']) &&
		(typeof config['brightness'] === 'number' || typeof config['brightness'] === 'undefined') &&
		(typeof config['saturation'] === 'number' || typeof config['saturation'] === 'undefined') &&
		(typeof config['hue'] === 'number' || typeof config['hue'] === 'undefined') &&
		(typeof config['lightness'] === 'number' || typeof config['lightness'] === 'undefined'),
	transform: (img, config) =>
		img.modulate({
			brightness: config['brightness'] ?? 1,
			saturation: config['saturation'] ?? 1,
			hue: config['hue'] ?? 0,
			lightness: config['lightness'] ?? 0,
		}),
} satisfies Transformer<'brightness' | 'saturation' | 'hue' | 'lightness'>
