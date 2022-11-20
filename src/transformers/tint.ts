import type { Transformer } from '../../types'

export default {
    name: 'threshold',
    matcher: (config) => typeof config['tint'] === 'string' && config['tint'].startsWith('#'),
    transform: (img, config) => img.tint(config['tint'])
} as Transformer<'tint'>