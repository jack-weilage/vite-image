import type { Transformer } from '../../types'
import type { Sharp } from 'sharp'

const max = (...numbers: number[]) => Math.round(Math.max(...numbers))
const resize = (img: Sharp, width: number, height: number) => 
    img.resize(max(width, 1), max(height, 1), { fit: 'fill' })

export default {
    name: 'resize',
    // See modulate.ts
    matcher: (config) => typeof (config['width'] ?? config['height']) === 'number'
        && (typeof config['width']  === 'number' || typeof config['width']  === 'undefined') 
        && (typeof config['height'] === 'number' || typeof config['height'] === 'undefined'),
    transform: (img, config, metadata) => {
        const { width, height } = config

        // Check this first as we don't need metadata.
        if (typeof width !== 'undefined' && typeof height !== 'undefined')
            return resize(img, width, height)

        // Everything after this will need metadata width/height
        if (!metadata.width || !metadata.height)
            return
        

        if (width && typeof height === 'undefined')
            return resize(img, width, width / metadata.width * metadata.height)

        if (typeof width === 'undefined' && height)
            return resize(img, height / metadata.height * metadata.width, height)
            
        throw new Error('This shouldn\'t happen. How did you get here?')
    }
} as Transformer