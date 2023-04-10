import type { PluginConfig, Transformer } from '../types'
import type { UserConfig } from 'vite'

import { create_hash, queue_transformers } from '../src/utils'
import { dirname, extname, join } from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { build } from 'vite'

// The plugin must reference the _built_ copy to ensure that the build worked correctly.
import image_plugin from '../dist/index'

/** @see https://stackoverflow.com/a/50052194 */
const base_path = dirname(fileURLToPath(import.meta.url))

// These shouldn't be included in `src/constants.ts` because they will only be used in testing.
export const base_image = sharp('./tests/fixtures/images/dog.jpg')
export const base_hash = '64db99769cd8b1dfe79a5e5d2ab0359623103ddd'

/** Builds and returns the result of importing a resource. */
export async function test_build(
	inputs: Record<string, (val: unknown[]) => void>,
	image_config: Partial<PluginConfig> = {},
	vite_config: Partial<UserConfig> = {},
): Promise<void> {
	// Create an object of shape { [path]: id }
	const ids = {} as Record<string, string>
	for (const path in inputs) {
		ids[path] = `id_${create_hash(Math.random().toString())}`
	}

	const { output } = (await build({
		root: join(base_path, 'fixtures'),
		logLevel: 'warn',
		build: {
			write: false,
			modulePreload: {
				polyfill: false,
			},
			minify: false,
		},
		plugins: [
			{
				name: 'test-entry',
				// If we're importing a script, return the proper path.
				resolveId(source, importer): string | undefined {
					if (source === 'index.js') {
						return join(dirname(importer ?? ''), 'index.js')
					}
				},
				// If we're importing a script, return a custom script, changing for every new import.
				load(file_id): string | undefined {
					if (file_id === join(base_path, 'fixtures', 'index.js')) {
						return Object.entries(ids)
							.map(([path, id]) => `import ${id} from './images/dog.jpg${path}'; globalThis['${id}'] = ${id}`)
							.join(';')
					}
				},
			},
			image_plugin(image_config),
		],
		...vite_config,
	})) as { output: { fileName: string; code: string }[] }

	// Select the script from the output.
	const script = output.find(({ fileName }) => extname(fileName) === '.js')
	if (!script) {
		throw new Error('Script not found.')
	}
	// Run the script.
	eval(script.code)

	for (const [path, func] of Object.entries(inputs)) {
		//@ts-expect-error: TypeScript doesn't know that this value exists after running `eval`.
		const value = globalThis[ids[path]]
		func(value)
	}
}
/** Get the hash of an image transformed with the provided transformer + input. */
export const test_transformer = (input: Record<string, unknown>, transformer: Transformer): Promise<string> =>
	queue_transformers(base_image.clone(), input, [transformer])
		.then(({ image }) => image.toBuffer())
		.then((buf) => create_hash(buf))
