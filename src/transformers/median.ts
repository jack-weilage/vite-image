import { Transformer } from '../../types'

export default {
    name: 'median',
    matcher: (config) => config['median'] === true || typeof config['sharpen'] === 'number',
    transform: (img, config) => img.median(config['median'] === true ? undefined : config['median'])
} as Transformer