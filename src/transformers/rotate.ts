import type { Transformer } from '../../types'

//BUG: This doesn't seem to work with the automatic EXIF rotate.
export default {
    name: 'rotate',
    matcher: (config) => typeof config['rotate'] === 'number',
    transform: (img, config) => img.rotate(config['rotate'])
} as Transformer