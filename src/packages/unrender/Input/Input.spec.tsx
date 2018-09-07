import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';

import Input from './';

afterEach(cleanup);

test('child can read the state of the input', () => {
  const { getByValue } = render(
    <Input initial={'foo'}>{({ value, connect }) => <input {...connect} value={value} />}</Input>
  );

  expect(getByValue('foo')).toBeInTheDocument();
});

test('child can be connected to the State wrapper that controls it', () => {
  const { getByValue } = render(
    <Input initial={'foo'}>{({ value, connect }) => <input {...connect} value={value} />}</Input>
  );

  const input = getByValue('foo');

  fireEvent.change(input, { target: { value: 'bar' } });

  expect(getByValue('bar')).toBeInTheDocument();
});
