import { Transformer } from '../../types'

export default {
    name: 'modulate',
    // Ugly ugly ugly. All options are either undefined or number, but at least one option must be number.
    matcher: (config) => 
       (typeof config['brightness'] === 'undefined' || typeof config['brightness'] === 'number')
    && (typeof config['saturation'] === 'undefined' || typeof config['saturation'] === 'number')
    && (typeof config['hue'] === 'undefined'        || typeof config['hue'] === 'number')
    && (typeof config['lightness'] === 'undefined'  || typeof config['lightness'] === 'number')
    && (typeof (config['brightness'] ?? config['saturation'] ?? config['hue'] ?? config['lightness']) === 'number'),
    transform: (img, config) => img.modulate({
        ...(typeof config['brightness'] === 'undefined' ? {  }: { brightness: config['brightness'] }),
        ...(typeof config['saturation'] === 'undefined' ? {  }: { saturation: config['saturation'] }),
        ...(typeof config['hue'] === 'undefined' ? {  }: { hue: config['hue'] }),
        ...(typeof config['lightness'] === 'undefined' ? {  }: { lightness: config['lightness'] }),
    })
} as Transformer