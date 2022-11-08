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
        // Something must be terribly wrong with the image if it doesn't have a width/height.
        if (!metadata.width || !metadata.height)
            return img
        
        const { width, height } = config

        return resize(img, 
            typeof width === 'number' ? width : metadata.height / metadata.width * (height ?? 1), 
            typeof height === 'number' ? height : metadata.width / metadata.height * (width ?? 1))
    }
} as Transformer