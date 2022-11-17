import type { Transformer } from '../../types'

export default {
    name: 'rotate',
    matcher: (config) => typeof config['rotate'] === 'number',
    transform: (img, config) => img.rotate(config['rotate'])
} as Transformer<'rotate'>