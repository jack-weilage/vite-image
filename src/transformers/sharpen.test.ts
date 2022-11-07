import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'sharpen', 'e3f665b7' ],
    [ 'sharpen=true', 'e3f665b7' ],
    [ 'sharpen=1', '68f2ebcd' ],
    [ 'sharpen=0', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'sharpen=false', '/assets/dog.1b15ce03.jpg?sharpen=false' ],
    [ 'sharpen=foo', '/assets/dog.1b15ce03.jpg?sharpen=foo' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))