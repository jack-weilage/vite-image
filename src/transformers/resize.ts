import type { Transformer } from '../../types'
import type { Sharp } from 'sharp'

const max = (...numbers: number[]) => Math.round(Math.max(...numbers))
const resize = (img: Sharp, width: number, height: number) => 
    img.resize(max(width, 1), max(height, 1), { fit: 'fill' })

export default {
    name: 'resize',
    matcher: (config) => {
        //TODO: This matcher can likely be replaced with the shorter one in `modulate`
        const { width, height } = config

        const width_valid = typeof width === 'number' && !isNaN(width)
        const height_valid = typeof height === 'number' && !isNaN(height)

        return width_valid && height_valid ||       // Both width and height are supplied
            width_valid && height === undefined ||  // Only width is supplied
            width === undefined && height_valid     // Only height is supplied
    },
    transform: (img, config, metadata) => {
        const { width, height } = config

        // Check this first as we don't need metadata.
        if (width !== undefined && height !== undefined)
            return resize(img, width, height)

        // Everything after this will need metadata width/height
        if (!metadata.width || !metadata.height)
            return
        

        if (width && height === undefined)
            return resize(img, width, width / metadata.width * metadata.height)

        if (width === undefined && height)
            return resize(img, height / metadata.height * metadata.width, height)
            
        throw new Error('This shouldn\'t happen. How did you get here?')
    }
} as Transformer