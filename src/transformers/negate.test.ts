import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'negate', '969d15e4' ],
    [ 'negate=true', '969d15e4' ],
    [ 'negate=false', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'negate=foo', '/assets/dog.1b15ce03.jpg?negate=foo' ],
    [ 'negate=1', '/assets/dog.1b15ce03.jpg?negate=1' ],
    [ 'negate=0', '/assets/dog.1b15ce03.jpg?negate=0' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))