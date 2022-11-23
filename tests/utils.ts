import { join, dirname, extname } from 'path'
import { build } from 'vite'
import image_plugin from '../'
import sharp from 'sharp'

import type { Window } from 'happy-dom'
import type { UserConfig } from 'vite'
import type { RollupOutput, OutputChunk } from 'rollup'
import type { PluginConfig } from '../'

/** Builds and returns the result of importing a resource. */
export const test = async function (window: Window, url: string, image_config: Partial<PluginConfig> = {}, vite_config: Partial<UserConfig> = {})
{
    const id = 'id_' + Math.random().toString().replace('.', '')

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
            
                resolveId(source, importer) {
                    if (source === 'index.js')
                        return join(dirname(importer || ''), 'index.js')
                },
                load(file_id) {
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

    //@ts-expect-error
    return window[id]
}

export const base_image = sharp('./tests/fixtures/images/dog.jpg')