import type { Transformer } from '../../types'

export default {
    name: 'grayscale',
    matcher: (config) => typeof config['grayscale'] === 'boolean',
    transform: (img, config) => img.grayscale(config['grayscale'])
} satisfies Transformer<'grayscale'>