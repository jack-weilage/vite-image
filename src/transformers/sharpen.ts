import type { Transformer } from '../../types'

import { clamp, is_true_or_number } from '../utils'

export default {
    name: 'sharpen',
    matcher: (config) => is_true_or_number(config['sharpen']),
    transform: (img, config) => {
        if (config['sharpen'] === true)
            return img.sharpen()

        return img.sharpen({ sigma: clamp(config['sharpen'], 0.01, 10000) })
    }
} satisfies Transformer<'sharpen'>