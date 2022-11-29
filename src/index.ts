import type { Cache, CacheEntry, PluginConfig, InternalImage, OutputImage } from '../types'
import type { Plugin, ResolvedConfig } from 'vite'

import { BUILD_PREFIX, BUILD_REGEX, DEV_PREFIX, DEV_REGEX } from './constants'
import default_transformers from './transformers'
import { queue_transformers, copy_only_keys, create_configs, create_hash, dedupe, filename, parse_plugin_config } from './utils'

import { createFilter, dataToEsm } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import sharp from 'sharp'
import { pathToFileURL } from 'url'

export type { PluginConfig, Transformer, TypedImage } from '../types'

/** The plugin, to be supplied to vite. */
export default function image(user_plugin_config: Partial<PluginConfig> = {}): Plugin {
    const plugin_config: PluginConfig = parse_plugin_config(user_plugin_config)

    const cache = new Map() as Cache
    const filter = createFilter(plugin_config.include, plugin_config.exclude)

    let vite_config: ResolvedConfig

    return {
        name: 'image',
        enforce: 'pre',
        // Called when the vite config is finalized.
        configResolved(config) { vite_config = config },
        // Called when a resource is being processed.
        async load(id: string) {
            if (!filter(id))
                return null

            const { searchParams, pathname } = new URL(id, 'file:')

            // Deal with export tags here so it can be removed from url.
            const user_exports = searchParams.get('export')
                ?.split(plugin_config.deliminator) as (keyof OutputImage)[] | undefined
            
            const exports = dedupe(user_exports ?? (plugin_config.default_exports || []))
                .filter(Boolean)
            
            // Remove `export` from search params to prevent having to deal with it later.
            searchParams.delete('export')

            // Rotate the image, then create a "new" image with that data, containing the original metadata.
            const base_image = sharp(await sharp(pathname)
                .rotate()
                .withMetadata()
                .toBuffer())

            const transformers = [ ...plugin_config.transformers, ...default_transformers ]

            const images = [] as InternalImage[]
            for (const config of create_configs(searchParams, plugin_config.deliminator)) {
                // Create a unique hash based on the filename and config (prevents accidentally ingesting the same image twice).
                const hash = create_hash(pathname + JSON.stringify(config))

                // If we've already processed this exact image/config...
                if (cache.has(hash)) {
                    // Just grab what we already have from the digest.
                    images.push((cache.get(hash) as CacheEntry).data)
                    continue
                }

                const { image, queued_transformers } = queue_transformers(base_image.clone(), config, transformers)

                // If the image didn't match a transformer, it shouldn't be processed
                if (queued_transformers.length === 0)
                    continue
                
                // `apply_transformers` doesn't actually run the transformations, only queues them.
                // We don't need the source in dev mode, but will always need the metadata.
                const { info, data: source } = await image.toBuffer({ resolveWithObject: true })

                // If we're in dev mode, we should supply an actual url here.
                let src = DEV_PREFIX + hash
                // If we're not in dev mode...
                if (!this.meta.watchMode) {
                    const name = `${filename(pathname)}.${info.format}`

                    const handle = this.emitFile({ name, source, type: 'asset' })
                    // We should make this path recognizable for `renderChunk`.
                    src = BUILD_PREFIX + handle
                }

                // Create the final object.
                const data: InternalImage = Object.assign(info, {
                    aspect: info.width / info.height,
                    src,
                    transformers: queued_transformers
                })

                // We haven't run across this image before, so cache the current image.
                cache.set(hash, { image, data })
                images.push(data)
            }
            // If every config was skipped, we shouldn't change the output.
            if (images.length === 0)
                return null

            // Run user-specified post-processing.
            const post_processed = plugin_config.post_process(images.map(img => copy_only_keys(img, exports)))

            // Transform the final data to an importable JavaScript file.
            return dataToEsm(post_processed)
        },
        //TODO: Add testing for dev mode (not 100% sure this works).
        // Called in dev/preview mode.
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                // If there's somehow no URL, this couldn't be an image.
                if (!req.url)
                    return next()

                // If the URL doesn't match the regex, this couldn't be in cache.
                if (!DEV_REGEX.test(req.url))
                    return next()
                
                const [, hash ] = req.url.match(DEV_REGEX)!
                
                // If the image isn't in the cache, we can't do anything with it.
                if (!cache.has(hash))
                    return next()
                
                const { image } = cache.get(hash) as CacheEntry

                // Pipe the image to response.
                return image.clone()
                    .pipe(res)
            })
        },
        //TODO: Write dedicated build tests.
        // Called in build mode.
        renderChunk(code) {
            // string.includes is quite a bit faster here.
            if (!code.includes(BUILD_PREFIX))
                return null
            
            const replacer = (_: string, hash: string) => vite_config.base + this.getFileName(hash)

            // If we don't need to generate a sourcemap, return early without using MagicString.
            if (!vite_config.build.sourcemap)
                return { code: code.replace(BUILD_REGEX, replacer) }

            // Use MagicString to generate a sourcemap (slower than a simple replace).
            const magic = new MagicString(code)
            magic.replace(BUILD_REGEX, replacer)

            return {
                code: magic.toString(),
                map: magic.generateMap({ hires: true })
            }
        }
    }
}