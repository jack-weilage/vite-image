import type { Transformer } from '../../types'

export default {
    name: 'blur',
    matcher: (config) => config['blur'] === true || typeof config['blur'] === 'number',
    transform: (img, config) => {
        if (config['blur'] === true)
            return img.blur()

        return img.blur(Math.max(config['blur'], 0.3))
    }
} as Transformer<'blur'>