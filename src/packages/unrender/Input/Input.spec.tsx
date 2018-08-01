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

test('child can set the value of the input directly', () => {
  const { getByValue, container } = render(
    <Input>
      {({ value, connect, set }) => <input {...connect} value={value} onChange={() => set('42')} />}
    </Input>
  );

  const input = container.querySelector('input');

  fireEvent.change(input);

  expect(getByValue('42')).toBeInTheDocument();
});

test('child can be connected to the State wrapper that controls it', () => {
  const { getByValue } = render(
    <Input initial={'foo'}>{({ value, connect }) => <input {...connect} value={value} />}</Input>
  );

  const input = getByValue('foo');

  input.value = 'bar';
  fireEvent.change(input);

  expect(getByValue('bar')).toBeInTheDocument();
});
