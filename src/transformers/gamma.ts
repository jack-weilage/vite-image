import { Transformer } from '../../types'

export default {
    name: 'gamma',
    matcher: (config) => config['gamma'] === true || typeof config['gamma'] === 'number',
    transform: (img, config) => img.gamma(config['gamma'] === true ? undefined : Math.min(Math.max(config['gamma'] as number, 1), 3))
} as Transformer