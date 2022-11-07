import type { Transformer } from '../../types'

export default {
    name: 'sharpen',
    matcher: (config) => config['sharpen'] === true || typeof config['sharpen'] === 'number',
    transform: (img, config) => img.sharpen(config['sharpen'] === true ? undefined : { sigma: Math.min(Math.max(config['sharpen'] as number, 0.01), 10000) })
} as Transformer