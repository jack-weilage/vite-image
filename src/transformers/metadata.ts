import type { Transformer } from '../../types'

export default {
    name: 'metadata',
    matcher: (config) => typeof config['metadata'] === 'boolean',
    transform: (img, config) => (config['metadata'] ? img.withMetadata() : img)
} as Transformer<'metadata'>