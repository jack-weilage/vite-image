import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'blur', 'f04613f5' ],
    [ 'blur=true', 'f04613f5' ],
    [ 'blur=1', 'd9accbaa' ],
    [ 'blur=0', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'blur=false', '/assets/dog.1b15ce03.jpg?blur=false' ],
    [ 'blur=foo', '/assets/dog.1b15ce03.jpg?blur=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))