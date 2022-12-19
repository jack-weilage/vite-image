import { it } from 'vitest'
import { create_configs, create_partial, dedupe, filename } from '../src/utils'

it('dedupes an iterable object', ({ expect }) => {
    // Simple array.
    expect(dedupe([ 'foo', 'bar', 'foo', true, 'true', false, true, '1', 1, 1, 5 ]))
        .toHaveLength(8)
    // Set.
    expect(dedupe(new Set([ 'foo', 'bar', 'baz', 'baz', 'foo' ])))
        .toHaveLength(3)
    // Iterable object.
    expect(dedupe(new URLSearchParams([
        [ 'foo', 'true' ],
        [ 'foo', 'bar' ],
        [ 'bar', 'baz' ]
    ]).keys()))
        .toHaveLength(2)
})

it('returns the name of a file', ({ expect }) => {
    // Normal path.
    expect(filename('./test.png'))
        .toBe('test')
    // No file extension.
    expect(filename('./test'))
        .toBe('test')
    // Multiple dots.
    expect(filename('./foo.bar.baz'))
        .toBe('foo.bar')
})

it('creates a partial object', ({ expect }) => {
    const obj = { foo: '1', bar: 2, baz: true }

    // Just select keys.
    expect(create_partial(obj, [ 'foo', 'bar' ]))
        .toMatchObject({ foo: '1', bar: 2 })
    // Select a non-existent key.
    expect(create_partial(obj, [ 'baz', 'qux' ]))
        .toMatchObject({ baz: true })
    // Don't select any keys.
    expect(create_partial(obj, []))
        .toMatchObject({})
})

it('creates an array of unique configs from URLSearchParams', ({ expect }) => {
    // Interesting values
    expect(create_configs(new URLSearchParams({
        foo: 'bar,baz',
        bar: '1.256,undefined,NaN',
        baz: '18,true,,hello',
        qux: 'true,false,foo,false'
    }), ','))
        .toHaveLength(54)
    // Empty values.
    expect(create_configs(new URLSearchParams({ foo: '', '!foo': '', '!bar': '' }), ','))
        .toHaveLength(2)
})