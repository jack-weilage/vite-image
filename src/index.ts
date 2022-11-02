import type { Plugin, ResolvedConfig } from 'vite'
import type { Digest, DigestEntry, PluginConfig, InternalImage, OutputImage, Transformer } from '../types'

import { BUILD_PREFIX, DEFAULT_CONFIG, DEV_PREFIX } from './constants'
import transforms from './transforms'
import { apply_transforms, copy_only_keys, create_configs, create_hash, dedupe, filename, params_to_obj, parse_config } from './utils'

import { createFilter, dataToEsm } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import sharp from 'sharp'
import { join } from 'path'


export type { PluginConfig, Transformer }

export default function image(user_config: Partial<PluginConfig> = {}): Plugin {
    const plugin_config: PluginConfig = parse_config(user_config, DEFAULT_CONFIG)

    const digested = new Map() as Digest
    const filter = createFilter(plugin_config.include, plugin_config.exclude)

    let viteConfig: ResolvedConfig

    return {
        name: 'image',
        enforce: 'pre',

        configResolved(config) { viteConfig = config },

        async load(id: string) {
            if (!filter(id))
                return null

            // `pathToFileURL` should be used here, but it doesn't parse like a normal url. Should be fine?
            const url = new URL(join(viteConfig.publicDir, id), 'file://')
            const base_img = sharp(url.pathname)
                .withMetadata()
            
            // Deal with output meta tags here so it can be removed from url.
            const exports = dedupe([
                ...plugin_config.default_exports,
                ...(url.searchParams.get('export') ?? '').split(plugin_config.deliminator) as (keyof OutputImage)[]
            ]).filter(Boolean)

            // If nothing is going to be output, why even process the image? This currently won't happen, as the defaults can't be overwritten.
            if (exports.length === 0)
            {
                if (this.meta.watchMode)
                    console.warn('Image', url.toString(), 'did not export any metadata.')
                
                return null
            }

            // Remove `meta` from search params to prevent having to deal with it later.
            url.searchParams.delete('meta')

            const images = [] as InternalImage[]
            for (const config of create_configs(params_to_obj(url.searchParams, plugin_config.deliminator))) {
                const hash = create_hash(url.toString() + JSON.stringify(config))

                // If we've already processed this exact image/config...
                if (digested.has(hash)) {
                    // Just grab what we already have from the digest.
                    images.push((digested.get(hash) as DigestEntry).data)
                    continue
                }

                const { img, is_transformed } = await apply_transforms(base_img.clone(), config, [...plugin_config.transformers, ...transforms])

                // If the image didn't match a transformer, it shouldn't be processed
                if (!is_transformed)
                    continue
                // Convert the transformed image to a buffer. We only need the buffer for build mode, but always need the metadata.
                //? Is there a way to get a transformed image's metadata without waiting for buffer?
                const { info, data: source } = await img.toBuffer({ resolveWithObject: true })

                // If we're in dev mode, we should supply an actual url here.
                let src = DEV_PREFIX + hash
                // If we're not in dev mode...
                if (!this.meta.watchMode) {
                    const name = `${filename(url.pathname)}.${info.format}`

                    const handle = this.emitFile({ name, source, type: 'asset' })
                    // We should make this path recognizable for `renderChunk`.
                    src = BUILD_PREFIX + handle
                }

                const data = {
                    ...info,
                    aspect: info.width / info.height,
                    src,
                }

                digested.set(hash, { img, data })
                images.push(data)
            }
            // If every config was skipped, we shouldn't change the output
            if (images.length === 0)
                return null

            const data: OutputImage[] = images.map(img => copy_only_keys(img, exports))
            return dataToEsm(data)
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
         * This function replaces every occurrence of a flagged url with a proper URL.
         */
        renderChunk(code) {
            const regex = new RegExp(`${BUILD_PREFIX}([a-z\\d]{8})`, 'g')

            let match: RegExpExecArray | null
            let s: MagicString | undefined

            while (match = regex.exec(code)) {
                s = s || new MagicString(code)
                const [full, hash] = match

                // Starting at the index of the match, replace the length of the match with 
                s.overwrite(match.index, match.index + full.length, viteConfig.base + this.getFileName(hash))
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