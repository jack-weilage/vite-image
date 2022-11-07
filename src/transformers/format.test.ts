import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'format=jpeg', '9814cf28' ],
    [ 'format=webp', '7bb66aee' ],
    [ 'format=png', '812fd15d' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash), 30 * 1000)

it.each([
    [ 'format=foo', '/assets/dog.1b15ce03.jpg?format=foo' ],
    [ 'format=true', '/assets/dog.1b15ce03.jpg?format=true' ],
    [ 'format=false', '/assets/dog.1b15ce03.jpg?format=false' ],
    [ 'format=1', '/assets/dog.1b15ce03.jpg?format=1' ],
    [ 'format=0', '/assets/dog.1b15ce03.jpg?format=0' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))