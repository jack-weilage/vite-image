import { Transformer } from '../../types'

export default {
    name: 'flip',
    matcher: (config) => typeof config['flip'] === 'boolean',
    transform: (img, config) => img.flip(config['flip'])
} as Transformer