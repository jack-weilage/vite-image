//TODO: Open a pull request in `@types/sharp`
import type { Transformer } from '../../types'

import { INPUT_COLORSPACES } from '../constants'

export default {
    name: 'colorspace',
    matcher: (config) => INPUT_COLORSPACES.includes(config['colorspace']!),
    //BUG: `@types/sharp` thinks that `toColorspace` should take a string, but doesn't narrow any further than that.
    transform: (img, config) => img.toColorspace(config['colorspace'] as string)
} as Transformer<'colorspace'>