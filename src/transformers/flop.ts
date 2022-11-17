import type { Transformer } from '../../types'

export default {
    name: 'flop',
    matcher: (config) => typeof config['flop'] === 'boolean',
    transform: (img, config) => img.flop(config['flop'])
} as Transformer<'flop'>