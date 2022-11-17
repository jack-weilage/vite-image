import type { Transformer } from '../../types'

export default {
    name: 'negate',
    matcher: (config) => typeof config['negate'] === 'boolean',
    transform: (img, config) => img.negate(config['negate'])
} as Transformer<'negate'>