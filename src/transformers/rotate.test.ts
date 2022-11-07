import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'rotate=1', '3d98f96b' ],
    [ 'rotate=0', '9814cf28' ],
    [ 'rotate=35', '34b02428' ],
    [ 'rotate=90', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'rotate', '/assets/dog.1b15ce03.jpg?rotate' ],
    [ 'rotate=true', '/assets/dog.1b15ce03.jpg?rotate=true' ],
    [ 'rotate=false', '/assets/dog.1b15ce03.jpg?rotate=false' ],
    [ 'rotate=foo', '/assets/dog.1b15ce03.jpg?rotate=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))