import type { Transformer } from '../../types'

import { is_true_or_number, clamp } from '../utils'

export default {
    name: 'gamma',
    matcher: (config) => is_true_or_number(config['gamma']),
    transform: (img, config) => {
        if (config['gamma'] === true)
            return img.gamma()

        return img.gamma(clamp(config['gamma'], 1, 3))
    }
} satisfies Transformer<'gamma'>