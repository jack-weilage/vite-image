import type { FormatEnum, Sharp } from 'sharp'

export enum ColorspaceEnum {
    // 'error',
    // 'multiband',
    'b-w',
    'histogram',
    'xyz',
    'lab',
    'cmyk',
    'labq',
    'rgb',
    'cmc',
    'lch',
    'labs',
    'srgb',
    'yxy',
    'fourier',
    'rgb16',
    'grey16',
    'matrix',
    'scrgb',
    'hsv',
    // 'last'
}
/** The config supplied to the plugin on startup. */
export interface PluginConfig {
    /** A glob string matching images to include. */
    include: string
    /** A glob string matching images to exclude. */
    exclude: string
    /** A character or string used to split multiple values in the same input. */
    deliminator: string
    /** An array of user-supplied transformers. */
    transformers: Transformer[]
    /** An array of default outputs. */
    default_exports: (keyof InternalImage)[]
    /** 
     * A function to run _after_ an image has been processed.
     * Receives an array of images output by `vite-image`, and should return another array of images.
     */
    post_process: (images: OutputImage[]) => OutputImage[]
}
/** The config supplied to transformers when processing. */
export interface ImageConfig {
    // format
    format: keyof FormatEnum

    // resize
    width?: number
    height?: number

    // blur
    blur: number | true
    // rotate
    rotate: number
    // flip
    flip: boolean
    // flop
    flop: boolean
    // sharpen
    sharpen: number | true
    // median
    median: number | true
    // gamma
    gamma: number | true
    // negate
    negate: boolean
    // normalize (american spelling)
    normalize: boolean
    // threshold
    threshold: number | true
    // modulate
    brightness?: number
    saturation?: number
    hue?: number
    lightness?: number

    // tint
    tint: string
    // grayscale (american spelling)
    grayscale: boolean
    // toColorspace
    colorspace: keyof typeof ColorspaceEnum

    // metadata
    metadata: boolean
}

export interface CacheEntry {
    image: Sharp
    data: InternalImage
}
export type Cache = Map<string, CacheEntry>

/** A function to "transform" an image. */
export interface Transformer<T extends keyof (ImageConfig & K) = keyof (ImageConfig & K), K extends Record<string, any> = {}> {
    /** Name to include in errors/output. */
    name: string
    /** Function to match config against. */
    matcher: (config: Partial<ImageConfig & K>) => boolean
    /** Function to transform image. */
    transform: (img: Sharp, config: Pick<ImageConfig & K, T>) => Sharp
}

/** The complete list of possible output values. */
export interface InternalImage {
    /** The aspect ratio of the image. */
    aspect: number
    /** An href to the location of the image. */
    src: string
    /** A list of applied transformers. */
    transformers: string[]

    /** The format of the image. */
    format: string
    /** The size (in bytes) of the image. */
    size: number
    /** The width (in pixels) of the image. */
    width: number
    /** The height (in pixels) of the image. */
    height: number
    /** The number of color bands (channels) in the image. */
    channels: 1 | 2 | 3 | 4
}
/** The type of an outputted image. Every value _could_ be undefined, because the key might be not exported. */
export type OutputImage = Partial<InternalImage>

/** A type to help with type-checking imports with custom exports. */
export type TypedImage<T extends keyof InternalImage = 'src' | 'aspect' | 'width' | 'height' | 'format'> = Pick<InternalImage, T>