import { Window } from 'happy-dom'
import { test } from './utils'
import { it, expect, describe, beforeEach } from 'vitest'

let window = new Window()
beforeEach(() => { window = new Window() })

describe('imports', () => {
    it.each([
        // Just a normal import.
        [ './images/dog.jpg', '/assets/dog.1b15ce03.jpg' ],
        // A little fancy. An import with searchparams
        [ './images/dog.jpg?foo=bar', '/assets/dog.1b15ce03.jpg?foo=bar' ],
        // Even fancier. An import with searchparams and hash
        [ './images/dog.jpg?foo=bar#baz-qux', '/assets/dog.1b15ce03.jpg?foo=bar#baz-qux' ]
    ])('does not affect default imports: %s === %s', async (input, output) => expect(await test(window, input)).toBe(output))
    
    it.each([
        [
            // An import with one value.
            'width=600',
            [ 'c8e3a72c' ]
        ],
        [
            // An import with multiple values.
            'width=600,800,1000',
            [ 'c8e3a72c', '501b0d89', '2b774681' ]
        ],
        [
            // An import with multiple inputs.
            'width=600&height=400',
            [ '806ee279' ] 
        ],
        [
            // An import with multiple inputs and multiple values.
            'width=600,800&height=400,500',
            [ '806ee279', 'bb560a2b', '89e59142', '4a3e2e91' ]
        ],
        [
            // An import with a boolean value.
            'blur=true',
            [ 'f04613f5' ]
        ],
        [
            // An import with a shorthand boolean value.
            'blur',
            [ 'f04613f5' ]
        ],
        [
            // An import combining both normal and shorthand values.
            'width=600&blur&height=400',
            [ '9598a46e' ]
        ],
        [
            // An import containing multiple copies of the same input.
            'width=500,600&height=800&width=400',
            [ '4ab0caa5', '32f5facd', '15990bc8' ]
        ]

    ])('affects custom imports: %s === %j', async (input, hashes) => {
        const data = await test(window, './images/dog.jpg?' + input)

        expect(data).toHaveLength(hashes.length)

        for (let i = 0; i < data.length; i++)
            expect(data[i].src.split('.')[1]).toEqual(hashes[i])
    })
})