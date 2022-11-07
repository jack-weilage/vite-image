import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'brightness=0', '5faf72ab' ],
    [ 'brightness=1000', 'a9f3e901' ],

    [ 'saturation=0', '3f1040b1' ],
    [ 'saturation=1000', 'e43c536a' ],

    [ 'hue=0', '9814cf28' ],
    [ 'hue=1000', 'f162fcbf' ],

    [ 'lightness=0', '9814cf28' ],
    [ 'lightness=1000', '58671a02' ],
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'brightness', '/assets/dog.1b15ce03.jpg?brightness' ],
    [ 'brightness&saturation=100', '/assets/dog.1b15ce03.jpg?brightness&saturation=100' ],
    [ 'lightness=foo', '/assets/dog.1b15ce03.jpg?lightness=foo' ],
    [ 'hue=0&lightness=foo', '/assets/dog.1b15ce03.jpg?hue=0&lightness=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))