import type { Transformer } from '../../types'
import { is_boolean } from '../utils'

export default {
    name: 'negate',
    matcher: (config) => is_boolean(config['negate']),
    transform: (img, config) => img.negate(config['negate'])
} satisfies Transformer<'negate'>