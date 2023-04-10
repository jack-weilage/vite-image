import { test_build } from './utils'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

test("doesn't affect normal imports", () =>
	test_build({
		'': (val) => assert.type(val, 'string'),
		'?foo=bar': (val) => assert.type(val, 'string'),
		'?foo=bar#baz-qux': (val) => assert.type(val, 'string'),
	}))

test('affects custom imports', () =>
	test_build({
		// One value.
		'?width=600': (val) => assert.equal(val.length, 1),
		// Multiple values.
		'?width=600,800,1000': (val) => assert.equal(val.length, 3),
		// Multiple inputs.
		'?width=600&height=400': (val) => assert.equal(val.length, 1),
		// Multiple inputs with multiple values.
		'?width=600,800&height=400,500': (val) => assert.equal(val.length, 4),
		// Boolean value.
		'?blur=true': (val) => assert.equal(val.length, 1),
		// Shorthand boolean value.
		'?blur': (val) => assert.equal(val.length, 1),
		// Negated shorthand boolean value.
		'?!flip': (val) => assert.equal(val.length, 1),
		// Negated and non-negated shorthand boolean values.
		'?blur&!flip': (val) => assert.equal(val.length, 1),
		// Normal and shorthand values
		'?blur&flip=true,false': (val) => assert.equal(val.length, 2),
		// Duplicated inputs.
		'?width=500,600&height=800&width=400': (val) => assert.equal(val.length, 3),
	}))

test.run()
