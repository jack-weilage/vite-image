import type { Transformer } from '../../types'

export default {
    name: 'modulate',
    // Surprisingly simple. 
    // First, make sure that at least _one_ of the options is a number.
    // Then make sure that _every_ option is either a number or undefined.
    // This will skip checking _every_ option if a single option isn't valid.
    matcher: (config) => typeof (config['brightness'] ?? config['saturation'] ?? config['hue'] ?? config['lightness']) === 'number'
        && (typeof config['brightness'] === 'number' || typeof config['brightness'] === 'undefined')
        && (typeof config['saturation'] === 'number' || typeof config['saturation'] === 'undefined')
        && (typeof config['hue']        === 'number' || typeof config['hue']        === 'undefined')
        && (typeof config['lightness']  === 'number' || typeof config['lightness']  === 'undefined'),
    transform: (img, config) => img.modulate({
        ...(typeof config['brightness'] === 'undefined' ? {  }: { brightness: config['brightness'] }),
        ...(typeof config['saturation'] === 'undefined' ? {  }: { saturation: config['saturation'] }),
        ...(typeof config['hue']        === 'undefined' ? {  }: { hue: config['hue'] }),
        ...(typeof config['lightness']  === 'undefined' ? {  }: { lightness: config['lightness'] }),
    })
} as Transformer