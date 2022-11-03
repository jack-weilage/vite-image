import { Transformer } from '../../types'

export default {
    name: 'sharpen',
    matcher: (config) => config['sharpen'] === true || typeof config['sharpen'] === 'number',
    transform: (img, config) => img.sharpen(config['sharpen'] === true ? undefined : { sigma: config['sharpen'] as number })
} as Transformer