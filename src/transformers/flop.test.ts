import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'flop', '4619a505' ],
    [ 'flop=true', '4619a505' ],
    [ 'flop=false', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'flop=foo', '/assets/dog.1b15ce03.jpg?flop=foo' ],
    [ 'flop=1', '/assets/dog.1b15ce03.jpg?flop=1' ],
    [ 'flop=0', '/assets/dog.1b15ce03.jpg?flop=0' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))