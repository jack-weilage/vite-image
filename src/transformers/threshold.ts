import type { Transformer } from '../../types'

export default {
    name: 'threshold',
    matcher: (config) => config['threshold'] === true || typeof config['threshold'] === 'number',
    transform: (img, config) => img.threshold(config['threshold'] === true ? undefined : Math.min(Math.max(config['threshold'] as number, 0), 255))
} as Transformer