import type { Transformer } from '../../types'

export default {
    name: 'threshold',
    matcher: (config) => typeof config['grayscale'] === 'boolean',
    transform: (img, config) => img.grayscale(config['grayscale'])
} as Transformer<'grayscale'>