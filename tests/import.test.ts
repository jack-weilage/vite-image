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
    it.each([
        [ './images/dog.jpg?width=600,1200&height=800,1600', [
            [ 600, 800 ],
            [ 600, 1600 ],
            [ 1200, 800 ],
            [ 1200, 1600 ]
        ] ],
        [ './images/dog.jpg?width=20,400,30&height=50', [
            [ 20, 50 ],
            [ 400, 50 ],
            [ 30, 50 ]
        ] ],
        [ './images/dog.jpg?width=500,800,1000', [
            [ 500, 375 ],
            [ 800, 600 ],
            [ 1000, 750 ]
        ] ],
        [ './images/dog.jpg?height=200,900,1000', [
            [ 267, 200 ],
            [ 1200, 900 ],
            [ 1333, 1000 ]
        ] ]
    ])('affects custom imports', async (input, output) => {
        const data = test(window, input)
            .then(images => images.map(img => [ img.width, img.height ]))
        
        expect(await data).toEqual(output)
    })
})