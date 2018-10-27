import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';

import { signIn } from '@/state/fetches';

import { SignIn } from './';

jest.mock('@/state/fetches', () => ({
  signIn: jest.fn()
}));

describe('SignIn page', () => {
  test('smoke', () => {
    const { getByLabelText, getByTestId } = render(<SignIn />);

    expect(getByLabelText(/username/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByTestId('signIn-button')).toBeInTheDocument();
  });

  describe('A successful sign in', () => {
    it('should be free of errors', async () => {
      const { getByLabelText, getByTestId } = render(<SignIn />);
      const usernameVal = 'chrstntdd';
      const passwordVal = 'password';

      const username = getByLabelText(/username/i);
      const password = getByLabelText(/password/i);
      const button = getByTestId('signIn-button');

      expect(button).toBeDisabled();

      fireEvent.change(username, {
        target: { value: usernameVal }
      });

      expect(button).toBeDisabled();

      fireEvent.change(password, {
        target: { value: passwordVal }
      });

      expect(button).not.toBeDisabled();

      fireEvent.click(button);

      expect(signIn).toHaveBeenCalledTimes(1);
      expect(signIn).toHaveBeenCalledWith({ username: usernameVal, password: passwordVal });
    });
  });

  describe('password visibility toggle', () => {
    it('should toggle the visibility of the password input lol', () => {
      const { getByLabelText, getByTestId } = render(<SignIn />);
      const passwordVal = 'password';

      const password = getByLabelText(/password/i);
      const toggle = getByTestId('password-vis-toggle');

      fireEvent.change(password, {
        target: { value: passwordVal }
      });

      expect(password).toHaveAttribute('type', 'password');

      fireEvent.click(toggle);

      expect(password).toHaveAttribute('type', 'text');
    });
  });
});
