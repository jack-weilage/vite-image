import type { Transformer } from '../../types'

import { minmax } from '../utils'

export default {
    name: 'threshold',
    matcher: (config) => config['threshold'] === true || typeof config['threshold'] === 'number',
    transform: (img, config) => img.threshold(config['threshold'] === true ? undefined : minmax(config['threshold'] as number, 0, 255))
} as Transformer