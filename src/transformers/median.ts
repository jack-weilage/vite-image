import type { Transformer } from '../../types'

import { clamp } from '../utils'

export default {
    name: 'median',
    matcher: (config) => config['median'] === true || typeof config['median'] === 'number',
    transform: (img, config) => {
        if (config['median'] === true)
            return img.median()

        return img.median(clamp(config['median'], 1, 1000))
    }
} as Transformer<'median'>