import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'normalize', 'd6351e5a' ],
    [ 'normalize=true', 'd6351e5a' ],
    [ 'normalize=false', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'normalize=foo', '/assets/dog.1b15ce03.jpg?normalize=foo' ],
    [ 'normalize=1', '/assets/dog.1b15ce03.jpg?normalize=1' ],
    [ 'normalize=0', '/assets/dog.1b15ce03.jpg?normalize=0' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))