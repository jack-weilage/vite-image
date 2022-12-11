//TODO: Open a pull request in `@types/sharp`
// `@types/sharp` thinks that `toColorspace` should take a string, but doesn't narrow any further than that.
import type { Transformer } from '../../types'

import { INPUT_COLORSPACES } from '../constants'

export default {
    name: 'colorspace',
    matcher: (config) => INPUT_COLORSPACES.includes(config['colorspace']!),
    transform: (img, config) => img.toColorspace(config['colorspace'] satisfies string)
} satisfies Transformer<'colorspace'>