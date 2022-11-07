import type { Transformer } from '../../types'

export default {
    name: 'median',
    matcher: (config) => config['median'] === true || typeof config['median'] === 'number',
    transform: (img, config) => img.median(config['median'] === true ? undefined : Math.min(Math.max(config['median'] as number, 1), 1000))
} as Transformer