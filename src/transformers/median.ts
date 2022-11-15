import type { Transformer } from '../../types'

import { minmax } from '../utils'

export default {
    name: 'median',
    matcher: (config) => config['median'] === true || typeof config['median'] === 'number',
    transform: (img, config) => {
        if (config['median'] === true)
            return img.median()

        return img.median(minmax(config['median'] as number, 1, 1000))
    }
} as Transformer