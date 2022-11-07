import type { Transformer } from '../../types'

//TODO: This overwrites the automatic EXIF rotate when first processing the image.
export default {
    name: 'rotate',
    matcher: (config) => typeof config['rotate'] === 'number',
    transform: (img, config) => img.rotate(config['rotate'])
} as Transformer