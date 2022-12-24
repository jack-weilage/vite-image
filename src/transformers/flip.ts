import type { Transformer } from '../../types'

import { is_boolean } from '../utils'

export default {
    name: 'flip',
    matcher: (config) => is_boolean(config['flip']),
    transform: (img, config) => img.flip(config['flip'])
} satisfies Transformer<'flip'>