import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import format from './format'

it('applies format when it should', ({ expect }) => Promise.all([
    // format=jpeg
    expect(test_transformer({ format: 'jpeg' }, format))
        .resolves.toBe(base_hash),
    // format=webp
    expect(test_transformer({ format: 'webp' }, format))
        .resolves.toMatchInlineSnapshot('"e28b8383971f599b2efe8ea3a128e284a1cb5cb4"'),
    // format=png
    expect(test_transformer({ format: 'png' }, format))
        .resolves.toMatchInlineSnapshot('"08f6793b0df7e4fdc3a9e52166015cb4fb62f8d4"')
]))
it('doesn\'t apply format when it shouldn\'t', ({ expect }) => Promise.all([
    // format=true
    expect(test_transformer({ format: true }, format))
        .resolves.toBe(base_hash),
    // format=false
    expect(test_transformer({ format: false }, format))
        .resolves.toBe(base_hash),
    // format=foo
    expect(test_transformer({ format: 'foo' }, format))
        .resolves.toBe(base_hash),
    // format=5
    expect(test_transformer({ format: 5 }, format))
        .resolves.toBe(base_hash)
]))