import type { Transformer } from '../../types'

import { clamp } from '../utils'

export default {
    name: 'gamma',
    matcher: (config) => config['gamma'] === true || typeof config['gamma'] === 'number',
    transform: (img, config) => {
        if (config['gamma'] === true)
            return img.gamma()

        return img.gamma(clamp(config['gamma'], 1, 3))
    }
} as Transformer<'gamma'>