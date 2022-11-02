import { Window } from 'happy-dom'
import { test } from './utils'
import { it, expect, describe, beforeEach } from 'vitest'


let window: Window
beforeEach(() => {
    window = new Window()
})

describe('imports', () => {
    it.each([
        // Just a normal import.
        [ './images/dog.jpg', '/assets/dog.1b15ce03.jpg' ],
        // A little fancy. An import with searchparams
        [ './images/dog.jpg?foo=bar', '/assets/dog.1b15ce03.jpg?foo=bar' ],
        // Even fancier. An import with searchparams and hash
        [ './images/dog.jpg?foo=bar#baz-qux', '/assets/dog.1b15ce03.jpg?foo=bar#baz-qux' ]
    ])('does not affect default imports', async (input, output) => expect(await test(window, input)).toBe(output))
    
    it('affects custom imports', async () => {
        const data = test(window, './images/dog.jpg?width=600,800,1200')
        
        expect(await data).toHaveLength(3)
    })
})