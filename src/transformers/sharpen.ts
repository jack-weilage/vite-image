import type { Transformer } from '../../types'

import { minmax } from '../utils'

export default {
    name: 'sharpen',
    matcher: (config) => config['sharpen'] === true || typeof config['sharpen'] === 'number',
    transform: (img, config) => {
        if (config['sharpen'] === true)
            return img.sharpen()

        return img.sharpen({ sigma: minmax(config['sharpen'] as number, 0.01, 10000) })
    }
} as Transformer