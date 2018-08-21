import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from 'react-testing-library';

import { SignUp } from './';

jest.mock('@/ui/pages/Auth/helpers', () => ({
  validateSignUpForm: jest.fn(() => ({ matchWith: jest.fn() }))
}));

afterEach(cleanup);

test('smoke', () => {
  const { getByLabelText, getByText } = render(<SignUp />);

  expect(getByLabelText(/email/i)).toBeInTheDocument();
  expect(getByLabelText(/username/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
  expect(getByText(/sign up/i)).toBeInTheDocument();
});
