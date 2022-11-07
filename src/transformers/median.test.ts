import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'median', '61d5cedc' ],
    [ 'median=true', '61d5cedc' ],
    [ 'median=1', '9814cf28' ],
    [ 'median=0', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'median=false', '/assets/dog.1b15ce03.jpg?median=false' ],
    [ 'median=foo', '/assets/dog.1b15ce03.jpg?median=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))