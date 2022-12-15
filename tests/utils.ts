import type { UserConfig } from 'vite'
import type { OutputImage, PluginConfig } from '../types'

import { join, dirname, extname } from 'path'
import { build } from 'vite'
import sharp from 'sharp'
import { create_hash } from '../src/utils'

// The plugin must reference the _built_ copy to ensure that the build worked correctly.
import image_plugin from '../'

/** Builds and returns the result of importing a resource. */
export async function test(url: string, image_config: Partial<PluginConfig> = {}, vite_config: Partial<UserConfig> = {}): Promise<OutputImage[]>
{
    const id = `id_${create_hash(Math.random().toString())}`

    const { output } = await build({
        root: join(__dirname, 'fixtures'),
        logLevel: 'warn',
        build: {
            write: false,
            modulePreload: {
                polyfill: false
            },
            minify: false
        },
        plugins: [
            {
                name: 'test-entry',
                // If we're importing a script, return the proper path.
                resolveId(source, importer): string | undefined
                {
                    if (source === 'index.js')
                        return join(dirname(importer ?? ''), 'index.js')
                },
                // If we're importing a script, return a custom script, changing for every new import.
                load(file_id): string | undefined
                {
                    if (file_id === join(__dirname, 'fixtures', 'index.js'))
                        return `import ${id} from '${url}'; globalThis['${id}'] = ${id}`
                }
            },
            image_plugin(image_config)
        ],
        ...vite_config
    }) as { output: { fileName: string, code: string }[] }

    const script = output.find(({ fileName }) => extname(fileName) === '.js')!
    eval(script.code)

    //@ts-expect-error: `string` cannot index window, but it doesn't matter here.
    return globalThis[id] as OutputImage[]
}

export const base_image = sharp('./tests/fixtures/images/dog.jpg')
export const base_hash = create_hash(await base_image.toBuffer())