import { expect, it } from 'vitest'
import { create_configs, create_partial, filename } from '../src/utils'

it.each([ './test', './foo.png', '/foo.bar.baz' ])('', (input) => {
    expect(filename(input)).toMatchSnapshot()
})

it.each([
    [ 'foo', 'bar', 'fake' ],
    [ 'foo', 'baz' ],
    []
])('`create_partial(\'%s\')`', (...input) => {
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
] as Record<string, string>[])('`create_configs(new URLSearchParams(%s), \',\')`', (input) => {
    expect(create_configs(new URLSearchParams(input), ',')).toMatchSnapshot()
})