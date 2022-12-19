import { it } from 'vitest'

import { base_hash, test_transformer } from '../../tests/utils'
import colorspace from './colorspace'

it('applies colorspace when it should', ({ expect }) => Promise.all([
    // colorspace=b-w
    expect(test_transformer({ colorspace: 'b-w' }, colorspace))
        .resolves.toMatchInlineSnapshot('"e237b47bfefaa14a99ad83857354ab95c4e80461"'),
    // colorspace=hsv
    expect(test_transformer({ colorspace: 'hsv' }, colorspace))
        .resolves.toMatchInlineSnapshot('"5045f81cf2091c95f76329a05dcbaf71b13af507"'),
    // colorspace=cmyk
    expect(test_transformer({ colorspace: 'cmyk' }, colorspace))
        .resolves.toMatchInlineSnapshot('"e8c8d84b019a44429a3f437ee4fa065b46b6090d"'),
    // colorspace=rgb16
    expect(test_transformer({ colorspace: 'rgb16' }, colorspace))
        .resolves.toBe(base_hash)
]))
it('doesn\'t apply colorspace when it shouldn\'t', ({ expect }) => Promise.all([
    // colorspace=true
    expect(test_transformer({ colorspace: true }, colorspace))
        .resolves.toBe(base_hash),
    // colorspace=false
    expect(test_transformer({ colorspace: false }, colorspace))
        .resolves.toBe(base_hash),
    // colorspace=error
    expect(test_transformer({ colorspace: 'error' }, colorspace))
        .resolves.toBe(base_hash),
    // colorspace=5
    expect(test_transformer({ colorspace: 5 }, colorspace))
        .resolves.toBe(base_hash)
]))