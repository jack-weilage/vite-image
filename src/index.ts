import type { PluginConfig, InternalImage } from '../types'
import type { Plugin, ResolvedConfig } from 'vite'
import type { Sharp } from 'sharp'
import type { SourceMap } from 'magic-string'

import { BUILD_PREFIX, BUILD_REGEX, DEV_PREFIX, DEV_REGEX } from './constants'
import default_transformers from './transformers'
import { queue_transformers, create_partial, create_configs, create_hash, dedupe, filename, parse_plugin_config } from './utils'

import { createFilter } from 'vite'
import MagicString from 'magic-string'
import sharp from 'sharp'

export type { PluginConfig, Transformer, TypedImage } from '../types'

/** The plugin, to be supplied to vite. */
export default function image(user_plugin_config: Partial<PluginConfig> = {}): Plugin
{
    const plugin_config = parse_plugin_config(user_plugin_config)

    //TODO: This cache stores both output data and the full Sharp instance. Will this cause memory problems?
    const cache = new Map<string, { image: Sharp; data: InternalImage }>()
    const filter = createFilter(plugin_config.include, plugin_config.exclude)

    let vite_config: ResolvedConfig

    return {
        name: 'image',
        enforce: 'pre',
        // Called when the vite config is finalized.
        configResolved(config): void { vite_config = config },
        // Called when a resource is being processed.
        async load(url: string): Promise<string | null>
        {
            if (!filter(url))
                return null

            const { searchParams, pathname } = new URL(url, 'file:')

            // Deal with export tags here so it can be removed from url.
            const user_exports = searchParams.get('export')
                ?.split(plugin_config.deliminator)

            const exports = dedupe(user_exports ?? plugin_config.default_exports)
                .filter(Boolean)

            // Remove `export` from search params to prevent having to deal with it later.
            searchParams.delete('export')

            // Rotate the image, then create a "new" image with that data, containing the original metadata.
            const base_image = sharp(await sharp(pathname)
                .rotate()
                .withMetadata()
                .toBuffer())

            const transformers = [ ...plugin_config.transformers, ...default_transformers ]

            const images: InternalImage[] = []
            for (const config of create_configs(searchParams, plugin_config.deliminator))
            {
                // Create an ID for this image. Hashing this ID is unnecessary to check cache.
                const id = pathname + JSON.stringify(config)
                // If we've already processed this exact image + config...
                if (cache.has(id))
                {
                    // Just grab what we already have from the cache.
                    images.push(cache.get(id)!.data)
                    continue
                }

                // We haven't processed this image + config before, so queue transformers.
                const { image, queued_transformers } = await queue_transformers(base_image.clone(), config, transformers)

                // If the image didn't match a transformer, it shouldn't be processed
                if (queued_transformers.length === 0)
                    continue

                // `apply_transformers` doesn't actually run the transformations, only queues them.
                // We don't need the source in dev mode, but will always need the metadata.
                const { info, data: source } = await image.toBuffer({ resolveWithObject: true })

                // If we're in dev mode, we should supply an actual url here.
                let src = DEV_PREFIX + create_hash(id)
                // If we're not in dev mode...
                if (!this.meta.watchMode)
                {
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
                cache.set(id, { image, data })
                images.push(data)
            }
            // If every config was skipped, we shouldn't change the output.
            if (images.length === 0)
                return null

            // Run user-specified post-processing.
            const post_processed = plugin_config.post_process(images.map(img => create_partial(img, exports)))

            // Transform the final data to an importable JavaScript file.
            return `export default ${JSON.stringify(post_processed)}`
        },
        //TODO: Add testing for dev mode (not 100% sure this works).
        // Called in dev/preview mode.
        configureServer(server): void
        {
            server.middlewares.use((req, res, next) => {
                // If there's somehow no URL, this couldn't be an image.
                if (!req.url)
                    return next()

                const exec = DEV_REGEX.exec(req.url)
                // If the URL doesn't match the regex, this couldn't be in cache.
                if (!exec?.[1])
                    return next()

                const hash = exec[1]

                // If the image isn't in the cache, we can't do anything with it.
                if (!cache.has(hash))
                    return next()

                const { image } = cache.get(hash)!

                // Pipe the image to response.
                return image.clone()
                    .pipe(res)
            })
        },
        //TODO: Write dedicated build tests.
        // Called in build mode.
        renderChunk(code): { code: string; map?: SourceMap } | null
        {
            // string.includes is quite a bit faster here.
            if (!code.includes(BUILD_PREFIX))
                return null

            const replacer = (_: string, hash: string): string => vite_config.base + this.getFileName(hash)

            // If we don't need to generate a sourcemap, return early without using MagicString.
            if (!vite_config.build.sourcemap)
                return { code: code.replace(BUILD_REGEX, replacer) }

            // Use MagicString to generate a sourcemap (slower than a simple replace).
            const magic = new MagicString(code)
                .replace(BUILD_REGEX, replacer)

            return {
                code: magic.toString(),
                map: magic.generateMap({ hires: true })
            }
        }
    }
}