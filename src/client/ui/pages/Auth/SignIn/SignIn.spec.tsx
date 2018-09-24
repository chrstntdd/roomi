import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from 'react-testing-library';

import { SignIn } from './';

afterEach(cleanup);

const props = {
  signIn: jest.fn(x => x)
};

test('smoke', () => {
  const { getByLabelText, getByText } = render(<SignIn {...props} />);

  expect(getByLabelText(/username/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
  expect(getByText(/sign in/i)).toBeInTheDocument();
});
