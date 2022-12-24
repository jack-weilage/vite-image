import type { Transformer } from '../../types'
import { is_boolean } from '../utils'

export default {
    name: 'normalize',
    matcher: (config) => is_boolean(config['normalize']),
    transform: (img, config) => img.normalize(config['normalize'])
} satisfies Transformer<'normalize'>