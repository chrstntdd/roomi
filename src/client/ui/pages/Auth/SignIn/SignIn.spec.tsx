import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from 'react-testing-library';

import { SignIn } from './';

afterEach(cleanup);

test('smoke', () => {
  const { getByLabelText, getByText } = render(<SignIn />);

  expect(getByLabelText(/username/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
  expect(getByText(/sign in/i)).toBeInTheDocument();
});
