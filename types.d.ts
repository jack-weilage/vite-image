import type { FormatEnum, Sharp, Metadata } from 'sharp'

export interface PluginConfig {
    include: string
    exclude: string

    deliminator: string
    transformers: Transformer[]

    default_exports: (keyof InternalImage)[]
    post_process: (images: OutputImage[]) => OutputImage[]
}

export type ImageConfig = Partial<{
    // format
    format: keyof FormatEnum

    // resize
    width: number
    height: number

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
    brightness: number
    saturation: number
    hue: number
    lightness: number
}>

export interface CacheEntry {
    img: Sharp
    data: InternalImage
}
export type Cache = Map<string, CacheEntry>

export interface Transformer {
    name: string
    matcher: (config: ImageConfig) => boolean
    transform: (img: Sharp, config: ImageConfig, metadata: Metadata) => Sharp
}

export interface InternalImage {
    aspect: number
    src: string
    transformers: string[]

    format: string
    size: number
    width: number
    height: number
    channels: 1 | 2 | 3 | 4
}
export type OutputImage = Partial<InternalImage>

export type TypedImage<T extends keyof InternalImage = 'src' | 'aspect' | 'width' | 'height' | 'format'> = Pick<InternalImage, T>[]