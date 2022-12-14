import { expect, it } from 'vitest'
import { create_configs, create_partial, dedupe, filename } from '../src/utils'

it.each([
    [ 'foo', 'bar', 'foo' ],
    [ true, 'true', false, true ],
    // Will already dedupe, whatever.
    new Set([ '1', '3', '1', '5' ]),
    new URLSearchParams([
        [ 'foo', 'true' ],
        [ 'foo', 'bar' ],
        [ 'bar', 'baz' ]
    ]).keys()
])('dedupe(%o)', (input) => {
    expect(dedupe(input)).toMatchSnapshot()
})
it.each([ './test', './foo.png', '/foo.bar.baz' ])('filename(%s)', (input) => {
    expect(filename(input)).toMatchSnapshot()
})

it.each([
    [ 'foo', 'bar', 'fake' ],
    [ 'foo', 'baz' ],
    []
])('create_partial(%j)', (...input) => {
    expect(create_partial({ foo: '1', bar: '2', baz: '3' }, input)).toMatchSnapshot()
})

it.each([
    {
        foo: 'bar,baz',
        bar: '1.256,undefined,NaN',
        qux: 'true,false,foo'
    },
    {
        foo: '',
        '!foo': '',
        '!bar': ''
    },
    {
        foo: '18,true,,hello'
    }
] as Record<string, string>[])('create_configs(new URLSearchParams(%j), \',\')`', (input) => {
    expect(create_configs(new URLSearchParams(input), ',')).toMatchSnapshot()
})