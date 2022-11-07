import type { Transformer } from '../../types'

export default {
    name: 'blur',
    matcher: (config) => config['blur'] === true || typeof config['blur'] === 'number',
    transform: (img, config) => img.blur(config['blur'] === true ? undefined : Math.max(config['blur'] as number, 0.3))
} as Transformer