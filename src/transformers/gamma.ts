import type { Transformer } from '../../types'

import { bounds } from '../utils'

export default {
    name: 'gamma',
    matcher: (config) => config['gamma'] === true || typeof config['gamma'] === 'number',
    transform: (img, config) => img.gamma(config['gamma'] === true ? undefined : bounds(config['gamma'] as number, 1, 3)),
} as Transformer