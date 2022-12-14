import type { PluginConfig, TypedImage, Transformer } from '../types'
import type { Plugin } from 'vite'

import { it, expectTypeOf } from 'vitest'

// Import plugin from build.
import plugin from '../'
import type { Sharp } from 'sharp'

it('matches correct types for plugin', () => {
    // The plugin should be a function.
    expectTypeOf(plugin).toBeFunction()

    // The config should either be a partial config or undefined.
    expectTypeOf(plugin).parameter(0)
        .toMatchTypeOf<Partial<PluginConfig> | undefined>()

    // The plugin should return a plugin.
    expectTypeOf(plugin).returns.toMatchTypeOf<Plugin>()
})
it('matches correct types for image', () => {
    // The default image should have 'format', 'width', 'height', 'aspect', 'src'.
    expectTypeOf({
        format: 'jpeg',
        width: 100,
        height: 100,
        aspect: 1,
        src: '/img.jpeg'
    }).toMatchTypeOf<TypedImage>()

    // An empty object shouldn't be an image.
    expectTypeOf({}).not.toMatchTypeOf<TypedImage>()

    //TODO: This check _should_ work, but vitest seems to break it.
    // expectTypeOf({
    //     format: 'jpeg',
    //     size: 10000
    // }).not.toMatchTypeOf<TypedImage<'format'>>()

    // A custom image should match its type.
    expectTypeOf({
        format: 'jpeg',
        size: 10000,
        src: '/img.jpeg'
    }).toMatchTypeOf<TypedImage<'format' | 'size' | 'src'>>()
})
it('matches correct types for transformer', () => {
    // A no-op transformer should match.
    expectTypeOf({
        name: 'blur',
        matcher: () => true,
        transform: (img: Sharp) => img
    }).toMatchTypeOf<Transformer<'blur'>>()

    // A custom transformer should match.
    expectTypeOf({
        name: 'test',
        matcher: (config: Record<string, unknown>) => (typeof config['foo'] !== 'undefined' && typeof config['bar'] !== 'undefined' && config['foo'] === config['bar']),
        transform: (img: Sharp) => img
    }).toMatchTypeOf<Transformer<'foo' | 'bar', { foo: number, bar?: number }>>()
})