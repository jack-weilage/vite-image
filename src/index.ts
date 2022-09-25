import type { Plugin, ResolvedConfig }                      from 'vite'
import type { Sharp }                                       from 'sharp'
import type { UserConfig, Digest, Metadata, DigestEntry }   from '../types'

import { create_hash, params_to_obj, create_configs, filename } from './utils'
import { FORMATS, DEV_PREFIX, BUILD_PREFIX } from './constants'

import { createFilter, dataToEsm }  from '@rollup/pluginutils'
import { basename, extname, format as path_format }        from 'path'
import sharp                        from 'sharp'
import MagicString                  from 'magic-string'

export { Digest, DigestEntry, ImageConfig, Metadata, SharpMetadata, UserConfig } from '../types'

export default function image(user_config: UserConfig = { }): Plugin
{
    const digested = new Map() as Digest
    const filter = createFilter('**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*', '')

    let viteConfig: ResolvedConfig

    return {
        name: 'image',
        enforce: 'pre',

        configResolved(config) { viteConfig = config },

        async load(id: string) {
            if (!filter(id))
                return null

            const url = new URL(id, 'file://')
            const base_img = sharp(url.pathname)
            
            const images = [] as Metadata[]
            for (const config of create_configs(params_to_obj(url.searchParams)))
            {
                const hash = create_hash(url.toString() + JSON.stringify(config))

                // If we've already processed this exact image/config...
                if (digested.has(hash))
                {
                    // Just grab what we already have from the digest.
                    images.push((digested.get(hash) as DigestEntry).data)
                    continue
                }

                const img = apply_transforms(base_img.clone(), config)

                const { info, data: source } = await img.toBuffer({ resolveWithObject: true })

                // If we're in dev mode, we should supply an actual url here.
                let src = DEV_PREFIX + hash
                // If we're not in dev mode...
                if (!this.meta.watchMode)
                {
                    const name = path_format({ base: filename(url.pathname), ext: info.format })
                    // const name = `${basename(url.pathname, extname(url.pathname))}.${info.format}`

                    const handle = this.emitFile({ name, source, type: 'asset' })
                    // We should make this path recognizable for `renderChunk`.
                    src = BUILD_PREFIX + handle
                }

                const data = {
                    meta: {
                        ...info,
                        aspect: info.width / info.height
                    },
                    src
                }

                digested.set(hash, { img, data })
                images.push(data)
            }

            return dataToEsm(images, { preferConst: true })
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url)
                    return next()
                
                const result = new RegExp(`^${DEV_PREFIX}(.*)$`).exec(req.url)
                
                // If the path does not match our regex, or we haven't digested this image, skip.
                if (!result || !digested.has(result[1]))
                    return next()


                return (digested.get(result[1]) as DigestEntry).img
                    .clone()
                    .pipe(res)
            })
        },
        /**
         * Code shamelessly stolen from `vite-imagetools`.
         * renderChunk runs on every chunk of code vite is rendering.
         * This function replaces every occurance of a flagged url with a proper URL.
         */
        renderChunk(code) {
            const regex = new RegExp(`${BUILD_PREFIX}([a-z\\d]{8})`, 'g')
      
            let match: RegExpExecArray | null
            let s: MagicString | undefined

            while (match = regex.exec(code)) {
                s = s || new MagicString(code)
                const [ full, hash ] = match
        
                const outputFilepath = viteConfig.base + this.getFileName(hash)
        
                // Starting at the index of the match, replace the length of the match with 
                s.overwrite(match.index, match.index + full.length, outputFilepath)
            }
      
            if (s) {
                return {
                    code: s.toString(),
                    map: viteConfig.build.sourcemap ? s.generateMap({ hires: true }) : null
                }
            }

            return null
        }
    }
}



type Config = Record<string, string | number | undefined>
const transforms: {
    name: string
    matcher: (config: Config) => boolean
    transform: (img: Sharp, config: Config) => Sharp
}[] = [
    {
        name: 'resize',
        matcher: (config: Config) => !!(config['width'] ?? config['w'] ?? config['height'] ?? config['h']),
        //@ts-expect-error
        transform: (img: Sharp, config: Config) => img.resize(config['width'] ?? config['w'], config['height'] ?? config['h'])
    },
    {
        name: 'format',
        //@ts-expect-error
        matcher: (config: Config) => FORMATS.includes(config['format'] || config['f']),
        //@ts-expect-error
        transform: (img: Sharp, config: Config) => img.toFormat(config['format'] ?? config['f'])
    },
    {
        name: 'blur',
        matcher: (config: Config) => config['blur'] === '' || (typeof config['blur'] === 'number' && !Number.isNaN(config['blur'])),
        //@ts-expect-error
        transform: (img: Sharp, config: Config) => img.blur(Math.max(config['blur'], 0.3))
    }
]
function apply_transforms(image: Sharp, config: Config)
{
    let img = image

    for (const transformer of transforms)
    {
        if (!transformer.matcher(config))
            continue
        
        img = transformer.transform(img, config)
    }
    return img
}