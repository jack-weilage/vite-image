import type { FormatEnum, OutputInfo, Sharp } from 'sharp'

export interface ImageConfig {
    format?: keyof FormatEnum
    width?: number
    height?: number
}
export interface UserConfig {
    fallback?: ImageConfig,
    // per_format: 
}

export type SharpMetadata = OutputInfo & {
    aspect: number
}
export interface Metadata {
    src: string

    meta: SharpMetadata
}

export interface DigestEntry {
    img: Sharp
    data: Metadata
}
export type Digest = Map<string, DigestEntry>