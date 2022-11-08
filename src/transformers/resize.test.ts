import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'width=100', 'f8f3058c' ],
    [ 'height=100', '02e4fa8b' ],
    [ 'width=100&height=100', 'bc1d38ce' ],

])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'width=false', '/assets/dog.1b15ce03.jpg?width=false' ],
    [ 'height=false', '/assets/dog.1b15ce03.jpg?height=false' ],
    [ 'width=100&height=foo', '/assets/dog.1b15ce03.jpg?width=100&height=foo' ],
    [ 'width=foo&height=100', '/assets/dog.1b15ce03.jpg?width=foo&height=100' ],
    [ 'width=foo', '/assets/dog.1b15ce03.jpg?width=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))