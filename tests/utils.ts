import { join, dirname, extname } from 'path'
import { build } from 'vite'
import image_plugin from '../'

import type { Window } from 'happy-dom'
import type { Plugin, UserConfig } from 'vite'
import type { RollupOutput, OutputChunk } from 'rollup'
import type { PluginConfig } from '../'

/** Replaces `index.js` with the code supplied */
export const test_plugin = (source: string): Plugin => ({
    name: 'test-entry',

    resolveId(source, importer) {
        if (source === 'index.js')
            return join(dirname(importer || ''), 'index.js')
    },
    load(id) {
        if (id === join(__dirname, 'fixtures', 'index.js')) 
            return source
    }
})

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
            }
        },
        plugins: [
            test_plugin(`
                import ${id} from '${url}'
                window['${id}'] = ${id}
            `),
            image_plugin(image_config)
        ],
        ...vite_config
    }) as RollupOutput

    const script = output.find(({ fileName }) => extname(fileName) === '.js') as OutputChunk
    window.eval(script.code)

    //@ts-expect-error
    return window[id]
}