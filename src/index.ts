//TODO: Add testing for dev mode (not 100% sure this works).
//TODO: Write dedicated build tests.
import type { InternalImage, PluginConfig } from '../types'
import type { SourceMap } from 'magic-string'
import type { Sharp } from 'sharp'
import type { Plugin, ResolvedConfig } from 'vite'

import { BUILD_PREFIX, BUILD_REGEX, DEV_PREFIX, DEV_REGEX } from './constants'
import default_transformers from './transformers'
import {
	create_configs,
	create_hash,
	create_partial,
	dedupe,
	filename,
	parse_plugin_config,
	queue_transformers,
} from './utils'

import MagicString from 'magic-string'
import sharp from 'sharp'
import { createFilter } from 'vite'

export type { PluginConfig, Transformer, TypedImage } from '../types'

/** The plugin, to be supplied to vite. */
export function image(user_plugin_config: Partial<PluginConfig> = {}): Plugin {
	const plugin_config = parse_plugin_config(user_plugin_config)

	const base_cache = new Map<string, Sharp>()
	const processed_cache = new Map<string, { image: Sharp; data: InternalImage }>()

	const filter = createFilter(plugin_config.include, plugin_config.exclude)

	let vite_config: ResolvedConfig

	return {
		name: 'image',
		enforce: 'pre',
		// Called when the vite config is finalized.
		configResolved(config): void {
			vite_config = config
		},
		// Called when a resource is being processed.
		async load(url: string): Promise<string | null> {
			if (!filter(url)) {
				return null
			}

			const { searchParams, pathname } = new URL(url, 'file:')

			// Deal with export tags here so it can be removed from url.
			const user_exports = searchParams.get('export')?.split(plugin_config.deliminator)

			// Dedupe export tags.
			const exports = dedupe(user_exports ?? plugin_config.default_exports)

			// Remove `export` from search params to prevent having to deal with it later.
			searchParams.delete('export')

			// If we haven't encountered this image before...
			if (!base_cache.has(pathname)) {
				// Auto-rotate the image, then create a "new" image with that data, containing the original metadata.
				const image = await sharp(pathname).rotate().withMetadata().toBuffer().catch(this.error)

				// Add the image to the cache.
				base_cache.set(pathname, sharp(image))
			}
			// The image is definitely now in the cache, so we can just grab it here.
			const base_image = base_cache.get(pathname)
			if (!base_image) {
				throw new Error("Could'nt find base_image in cache.")
			}

			const transformers = [...plugin_config.transformers, ...default_transformers]

			const images: InternalImage[] = []
			for (const config of create_configs(searchParams, plugin_config.deliminator)) {
				// Create an ID for this image. Hashing this ID is unnecessary to check cache.
				const id = pathname + JSON.stringify(config)
				// If we've already processed this exact image + config...
				const cached_image = processed_cache.get(id)
				if (cached_image) {
					// Just grab what we already have from the cache.
					images.push(cached_image.data)
					continue
				}

				// We haven't processed this image + config before, so queue transformers.
				const { image, queued_transformers, errors } = await queue_transformers(
					base_image.clone(),
					config,
					transformers,
				)

				// If there were errors while processing, warn about them here.
				if (errors.errors.length !== 0) {
					this.warn(errors)
				}

				// If the image didn't match a transformer, it shouldn't be processed
				if (queued_transformers.length === 0) {
					continue
				}

				// `apply_transformers` doesn't actually run the transformations, only queues them.
				// We don't need the source in dev mode, but will always need the metadata.
				const { info, data: source } = await image.toBuffer({ resolveWithObject: true }).catch(this.error)

				// If we're in dev mode, we should supply an actual url here.
				let src = DEV_PREFIX + create_hash(id)
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
					transformers: queued_transformers,
				})

				// We haven't run across this image before, so cache the current image.
				processed_cache.set(id, { image, data })
				images.push(data)
			}
			// If every config was skipped, we shouldn't change the output.
			if (images.length === 0) {
				return null
			}

			// Transform the final data to an importable JavaScript file.
			return `export default ${JSON.stringify(images.map((img) => create_partial(img, exports)))}`
		},
		// Called in dev/preview mode.
		configureServer(server): void {
			server.middlewares.use((req, res, next) => {
				// If there's somehow no URL, this couldn't be an image.
				if (!req.url) {
					return next()
				}

				const exec = DEV_REGEX.exec(req.url)
				// If the URL doesn't match the regex, this couldn't be in cache.
				if (!exec?.[1]) {
					return next()
				}

				const cached_item = processed_cache.get(exec[1])
				// If the image isn't in the cache, we can't do anything with it.
				if (!cached_item) {
					return next()
				}

				// Pipe the image to response.
				return cached_item.image.clone().pipe(res)
			})
		},

		// Called in build mode.
		renderChunk(code): { code: string; map?: SourceMap } | null {
			// string.includes is quite a bit faster here.
			if (!code.includes(BUILD_PREFIX)) {
				return null
			}

			const replacer = (_: string, hash: string): string => vite_config.base + this.getFileName(hash)

			// If we don't need to generate a sourcemap, return early without using MagicString.
			if (!vite_config.build.sourcemap) {
				return {
					code: code.replace(BUILD_REGEX, replacer),
				}
			}

			// Use MagicString to generate a sourcemap (slower than a simple replace).
			const magic = new MagicString(code).replace(BUILD_REGEX, replacer)

			return {
				code: magic.toString(),
				map: magic.generateMap({ hires: true }),
			}
		},
	}
}

export default image
