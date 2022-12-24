import { test as test_build } from './utils'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

test('doesn\'t affect normal imports', () => Promise.all([
    // dog.jpg
    test_build('')
        .then(val => assert.type(val, 'string')),
    // dog.jpg?foo=bar
    test_build('?foo=bar')
        .then(val => assert.type(val, 'string')),
    // dog.jpg?foo=bar#baz-qux
    test_build('?foo=bar#baz-qux')
        .then(val => assert.type(val, 'string'))
]) as unknown as Promise<void>)

test('affects custom imports', () => Promise.all([
    // One value.
    test_build('?width=600')
        .then(val => assert.equal(val.length, 1)),
    // Multiple values.
    test_build('?width=600,800,100')
        .then(val => assert.equal(val.length, 3)),
    // Multiple inputs.
    test_build('?width=600&height=400')
        .then(val => assert.equal(val.length, 1)),
    // Multiple inputs with multiple values.
    test_build('?width=600,800&height=400,500')
        .then(val => assert.equal(val.length, 4)),
    // Boolean value.
    test_build('?blur=true')
        .then(val => assert.equal(val.length, 1)),
    // Shorthand boolean value.
    test_build('?blur')
        .then(val => assert.equal(val.length, 1)),
    // Negated shorthand boolean value.
    test_build('?!flip')
        .then(val => assert.equal(val.length, 1)),
    // Negated and non-negated shorthand boolean values.
    test_build('?blur&!flip')
        .then(val => assert.equal(val.length, 1)),
    // Normal and shorthand values
    test_build('?blur&flip=true,false')
        .then(val => assert.equal(val.length, 2)),
    // Duplicated inputs.
    test_build('?width=500,600&height=800&width=400')
        .then(val => assert.equal(val.length, 3))
]) as unknown as Promise<void>)

test.run()