import { join, dirname, extname } from 'path'
import { build } from 'vite'
import image_plugin from '../'
import sharp from 'sharp'
import { create_hash } from '../src/utils'

import type { Window } from 'happy-dom'
import type { UserConfig } from 'vite'
import type { RollupOutput, OutputChunk } from 'rollup'
import type { PluginConfig } from '../'
import type { OutputImage } from '../types'

/** Builds and returns the result of importing a resource. */
export async function test(window: Window, url: string, image_config: Partial<PluginConfig> = {}, vite_config: Partial<UserConfig> = {}): Promise<OutputImage[]>
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

                resolveId(source, importer): string | undefined
                {
                    if (source === 'index.js')
                        return join(dirname(importer ?? ''), 'index.js')
                },
                load(file_id): string | undefined
                {
                    if (file_id === join(__dirname, 'fixtures', 'index.js'))
                        return `import ${id} from '${url}'; window['${id}'] = ${id}`
                }
            },
            image_plugin(image_config)
        ],
        ...vite_config
    }) as RollupOutput

    const script = output.find(({ fileName }) => extname(fileName) === '.js') as OutputChunk
    window.eval(script.code)

    //@ts-expect-error: `string` cannot index window, but it doesn't matter here.
    return window[id] as OutputImage[]
}

export const base_image = sharp('./tests/fixtures/images/dog.jpg')
export const base_hash = create_hash(await base_image.toBuffer())