import type { FormatEnum, OutputInfo, Sharp, Metadata } from 'sharp'

export interface PluginConfig {
    include: string
    exclude: string
    
    deliminator: string
    transformers: Transformer[]

    default_meta: (keyof InternalImage)[]
}
export interface ImageConfig {
    width?: number
    height?: number

    format?: keyof FormatEnum

    blur?: number | true
}

export interface DigestEntry {
    img: Sharp
    data: InternalImage
}
export type Digest = Map<string, DigestEntry>

export type Transformer = {
    name: string
    matcher: (config: ImageConfig) => boolean
    transform: (img: Sharp, config: ImageConfig, metadata: Metadata) => Sharp
}



export type InternalImage = OutputInfo & {
    aspect: number
    src: string
}
export type OutputImage = Partial<InternalImage>