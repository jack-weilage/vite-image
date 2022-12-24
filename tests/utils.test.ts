import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { is_boolean, is_number, is_true_or_number, create_configs, create_partial, dedupe, filename } from '../src/utils'


test('dedupes an iterable object', () => {
    // Simple array.
    assert.is(dedupe([ 'foo', 'bar', 'foo', true, 'true', false, true, '1', 1, 1, 5 ]).length, 8)
    // Set.
    assert.is(dedupe(new Set([ 'foo', 'bar', 'baz', 'baz', 'foo' ])).length, 3)
    // Iterable object.
    assert.is(dedupe(new URLSearchParams([
        [ 'foo', 'true' ],
        [ 'foo', 'bar' ],
        [ 'bar', 'baz' ]
    ]).keys()).length, 2)
})

test('returns the name of a file', () => {
    // Normal path.
    assert.is(filename('./test.png'), 'test')
    // No file extension.
    assert.is(filename('./test'), 'test')
    // Multiple dots.
    assert.is(filename('./foo.bar.baz'), 'foo.bar')
})

test('creates a partial object', () => {
    const obj = { foo: '1', bar: 2, baz: true }

    // Just select keys.
    assert.equal(create_partial(obj, [ 'foo', 'bar' ]), { foo: '1', bar: 2 })
    // Select a non-existent key.
    assert.equal(create_partial(obj, [ 'baz', 'qux' ]), { baz: true })
    // Don't select any keys.
    assert.equal(create_partial(obj, []), {})
})

test('creates an array of unique configs from URLSearchParams', () => {
    // Interesting values
    assert.is(create_configs(new URLSearchParams({
        foo: 'bar,baz',
        bar: '1.256,undefined,NaN',
        baz: '18,true,,hello',
        qux: 'true,false,foo,false'
    }), ',').length, 54)
    // Empty values.
    assert.is(create_configs(new URLSearchParams({ foo: '', '!foo': '', '!bar': '' }), ',').length, 2)
    // Single value.
    assert.is(create_configs(new URLSearchParams({ foo: 'bar,baz' }), ',').length, 2)
})

test('correctly matches values', () => {
    const functions = {
        'boolean': is_boolean,
        'number': is_number,
        'true_or_number': is_true_or_number
    }
    const output = {} as Record<string, unknown[]>

    for (const [ name, func ] of Object.entries(functions))
    {
        output[name] = []

        for (const value of [ 1, 0, true, false, 'foo', 'bar', undefined ])
            if (func(value))
                output[name].push(value)
    }

    assert.equal(output, {
        'boolean': [ true, false ],
        'number': [ 1, 0 ],
        'true_or_number': [ 1, 0, true ]
    })
})

test.run()