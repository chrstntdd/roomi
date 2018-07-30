import diiv from './';

const testObj = {
  undef: undefined,
  zero: 0,
  one: 1,
  n: null,
  f: false,
  a: {
    two: 2,
    b: {
      three: 3,
      c: {
        four: 4
      }
    }
  }
};

function checkEquality(path, value, _default?: any) {
  const result = diiv(testObj, path, _default);
  expect(result).toStrictEqual(value);

  /* Check for array syntax support */
  if (path) {
    const arr = path.split('.');
    expect(diiv(testObj, arr, _default)).toStrictEqual(value);
  }
}

test('can access an object in dot notation', () => {
  checkEquality('undef', testObj.undef);
  checkEquality('', undefined);
  checkEquality('one', testObj.one);
  checkEquality('one.two', undefined);
  checkEquality('a', testObj.a);
  checkEquality('a.two', testObj.a.two);
  checkEquality('a.b', testObj.a.b);
  checkEquality('a.b.three', testObj.a.b.three);
  checkEquality('a.b.c', testObj.a.b.c);
  checkEquality('a.b.c.four', testObj.a.b.c.four);
  checkEquality('n', testObj.n);
  checkEquality('n.badkey', undefined);
  checkEquality('f', false);
  checkEquality('f.badkey', undefined);
});

test('can handle errors states with a default value', () => {
  checkEquality('', 'foo', 'foo');
  checkEquality('undef', 'foo', 'foo');
  checkEquality('n', null, 'foo');
  checkEquality('n.badkey', 'foo', 'foo');
  checkEquality('zero', 0, 'foo');
  checkEquality('a.badkey', 'foo', 'foo');
  checkEquality('a.badkey.anotherbadkey', 'foo', 'foo');
  checkEquality('f', false, 'foo');
  checkEquality('f.badkey', 'foo', 'foo');
});

test('accessing and undefined key or value without a default will result in undefined being returned', () => {
  expect(diiv(testObj, 'a.unknownKey')).toBeUndefined();
  expect(diiv(testObj, 'a.undef')).toBeUndefined();

  expect(diiv(testObj, 'a.unknownKey', 'Safe default')).toEqual('Safe default');
});
