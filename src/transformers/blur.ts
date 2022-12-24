import type { Transformer } from '../../types'

import { is_true_or_number, clamp } from '../utils'

export default {
    name: 'blur',
    matcher: (config) => is_true_or_number(config['blur']),
    transform: (img, config) => {
        if (config['blur'] === true)
            return img.blur()

        return img.blur(clamp(config['blur'], 0.3, 1000))
    }
} satisfies Transformer<'blur'>