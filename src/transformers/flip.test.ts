import { Window } from 'happy-dom'
import { beforeEach, expect, it } from 'vitest'
import { test } from '../../tests/utils'

let window: Window
beforeEach(() => { window = new Window() })

it.each([
    [ 'flip', '0dc4883f' ],
    [ 'flip=true', '0dc4883f' ],
    [ 'flip=false', '9814cf28' ]
])('applies the transform %s === %s', async (input, hash) => expect((await test(window, './images/dog.jpg?' + input))[0].src.split('.')[1]).toBe(hash))

it.each([
    [ 'flip=foo', '/assets/dog.1b15ce03.jpg?flip=foo' ],
    [ 'flip=1', '/assets/dog.1b15ce03.jpg?flip=1' ],
    [ 'flip=0', '/assets/dog.1b15ce03.jpg?flip=0' ]
])('doesn\'t apply the transform %s === %s', async (input, output) => expect(await test(window, './images/dog.jpg?' + input)).toBe(output))