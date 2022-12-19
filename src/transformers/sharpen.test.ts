import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import sharpen from './sharpen'

it('applies sharpen when it should', ({ expect }) => Promise.all([
    // sharpen=true
    expect(test_transformer({ sharpen: true }, sharpen))
        .resolves.toMatchInlineSnapshot('"aa2fd5583a0ec2f10a9b3f5411b63f6f8aba913f"'),
    // sharpen=1
    expect(test_transformer({ sharpen: 1 }, sharpen))
        .resolves.toMatchInlineSnapshot('"26194e16687d68984e03593666f4686e8c065bf6"'),
    // sharpen=10
    expect(test_transformer({ sharpen: 10 }, sharpen))
        .resolves.toMatchInlineSnapshot('"ff93e49652e1edc65c585d070998f2eb4c09da82"'),
    // sharpen=0.01
    expect(test_transformer({ sharpen: 0.01 }, sharpen))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply sharpen when it shouldn\'t', ({ expect }) => Promise.all([
    // sharpen=false
    expect(test_transformer({ sharpen: false }, sharpen))
        .resolves.toBe(base_hash),
    // sharpen=foo
    expect(test_transformer({ sharpen: 'foo' }, sharpen))
        .resolves.toBe(base_hash)
]))