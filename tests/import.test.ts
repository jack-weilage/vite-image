import { test } from './utils'
import { it } from 'vitest'

it('doesn\'t affect normal imports', ({ expect }) => Promise.all([
    // dog.jpg
    expect(test(''))
        .resolves.toBeTypeOf('string'),
    // dog.jpg?foo=bar
    expect(test('?foo=bar'))
        .resolves.toBeTypeOf('string'),
    // dog.jpg?foo=bar#baz-qux
    expect(test('?foo=bar#baz-qux'))
        .resolves.toBeTypeOf('string')
]))
it('affects custom imports', ({ expect }) => Promise.all([
    // One value.
    expect(test('?width=600'))
        .resolves.toHaveLength(1),
    // Multiple values.
    expect(test('?width=600,800,100'))
        .resolves.toHaveLength(3),
    // Multiple inputs.
    expect(test('?width=600&height=400'))
        .resolves.toHaveLength(1),
    // Multiple inputs with multiple values.
    expect(test('?width=600,800&height=400,500'))
        .resolves.toHaveLength(4),
    // Boolean value.
    expect(test('?blur=true'))
        .resolves.toHaveLength(1),
    // Shorthand boolean value.
    expect(test('?blur'))
        .resolves.toHaveLength(1),
    // Negated shorthand boolean value.
    expect(test('?!flip'))
        .resolves.toHaveLength(1),
    // Negated and non-negated shorthand boolean values.
    expect(test('?blur&!flip'))
        .resolves.toHaveLength(1),
    // Normal and shorthand values
    expect(test('?blur&flip=true,false'))
        .resolves.toHaveLength(2),
    // Duplicated inputs.
    expect(test('?width=500,600&height=800&width=400'))
        .resolves.toHaveLength(3)
]))