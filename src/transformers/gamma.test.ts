import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

//BUG: Seems not to work (just me?)
it.each([
    [ 'gamma', '1e626464' ],
    [ 'gamma=true', '1e626464' ],
    [ 'gamma=1', '9814cf28' ],
    [ 'gamma=0', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'gamma=false', '/assets/dog.1b15ce03.jpg?gamma=false' ],
    [ 'gamma=foo', '/assets/dog.1b15ce03.jpg?gamma=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))