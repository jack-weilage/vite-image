import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'threshold', '543e67ab' ],
    [ 'threshold=true', '543e67ab' ],
    [ 'threshold=1', '589d0a52' ],
    [ 'threshold=0', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'threshold=false', '/assets/dog.1b15ce03.jpg?threshold=false' ],
    [ 'threshold=foo', '/assets/dog.1b15ce03.jpg?threshold=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))