import type { Transformer } from '../../types'

export default {
    name: 'normalize',
    matcher: (config) => typeof config['normalize'] === 'boolean',
    transform: (img, config) => img.normalize(config['normalize'])
} as Transformer<'normalize'>