import type { OutputImage } from '../types'

import { Window } from 'happy-dom'
import { test } from './utils'
import { it, expect, describe, beforeEach } from 'vitest'

let window = new Window()
beforeEach(() => { window = new Window() })

describe('imports', () => {
    it.each([
        // Just a normal import.
        '',
        // A little fancy. An import with searchparams
        '?foo=bar',
        // Even fancier. An import with searchparams and hash
        '?foo=bar#baz-qux'
    ])('does not affect default imports: %s', async (input) => {
        expect(await test(window, './images/dog.jpg' + input)).toMatchSnapshot()
    })
    
    it.each([
        // An import with one value.
        'width=600',
        // An import with multiple values.
        'width=600,800,1000',
        // An import with multiple inputs.
        'width=600&height=400',
        // An import with multiple inputs and multiple values.
        'width=600,800&height=400,500',
        // An import with a boolean value.
        'blur=true',
        // An import with a shorthand boolean value.
        'blur',
        // An import combining both normal and shorthand values.
        'width=600&blur&height=400',
        // An import containing multiple copies of the same input.
        'width=500,600&height=800&width=400'
    ])('affects custom imports: %s', async (input) => {
        const data: OutputImage[] = await test(window, './images/dog.jpg?' + input)
        
        expect(data.map(obj => obj.src)).toMatchSnapshot()
    })
})