import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import modulate from './modulate'

it('applies modulate when it should', ({ expect }) => Promise.all([
    // brightness=50
    expect(test_transformer({ brightness: 50 }, modulate))
        .resolves.toMatchInlineSnapshot('"cca391a9d1f8f1e30095c9efc4d06cb2be7ad22f"'),
    // saturation=50
    expect(test_transformer({ saturation: 50 }, modulate))
        .resolves.toMatchInlineSnapshot('"274b6fa0b55114f973ce7fe5ceea202efdb58f68"'),
    // hue=50
    expect(test_transformer({ lightness: 50 }, modulate))
        .resolves.toMatchInlineSnapshot('"c9ca9af78fd7b0ca486997bbe3e58bfbd66cd4c8"'),
    // lightness=50
    expect(test_transformer({ lightness: 50 }, modulate))
        .resolves.toMatchInlineSnapshot('"c9ca9af78fd7b0ca486997bbe3e58bfbd66cd4c8"')
]))
it('doesn\'t apply modulate when it shouldn\'t', ({ expect }) => Promise.all([
    // brightness=true
    expect(test_transformer({ brightness: false }, modulate))
        .resolves.toBe(base_hash),
    // saturation=baz
    expect(test_transformer({ saturation: 'baz' }, modulate))
        .resolves.toBe(base_hash),
    // hue=true
    expect(test_transformer({ hue: true }, modulate))
        .resolves.toBe(base_hash),
    // lightness=foo
    expect(test_transformer({ lightness: 'foo' }, modulate))
        .resolves.toBe(base_hash)
]))