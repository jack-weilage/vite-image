import type { Transformer } from '../../types'

import { minmax } from '../utils'

export default {
    name: 'gamma',
    matcher: (config) => config['gamma'] === true || typeof config['gamma'] === 'number',
    transform: (img, config) => {
        if (config['gamma'] === true)
            return img.gamma()

        return img.gamma(minmax(config['gamma'] as number, 1, 3))
    }
} as Transformer