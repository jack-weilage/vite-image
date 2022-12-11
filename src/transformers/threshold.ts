import type { Transformer } from '../../types'

import { clamp } from '../utils'

export default {
    name: 'threshold',
    matcher: (config) => config['threshold'] === true || typeof config['threshold'] === 'number',
    transform: (img, config) => {
        if (config['threshold'] === true)
            return img.threshold()

        return img.threshold(clamp(config['threshold'], 0, 255))
    }
} satisfies Transformer<'threshold'>