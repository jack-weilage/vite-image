import type { Transformer } from '../../types'

import { is_true_or_number, clamp } from '../utils'

export default {
    name: 'median',
    matcher: (config) => is_true_or_number(config['median']),
    transform: (img, config) => {
        if (config['median'] === true)
            return img.median()

        return img.median(clamp(config['median'], 1, 1000))
    }
} satisfies Transformer<'median'>