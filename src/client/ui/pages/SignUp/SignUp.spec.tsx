import React from 'react'
import 'jest-dom/extend-expect'
import { render, cleanup, fireEvent } from 'react-testing-library'

import { signUp } from '@/state/fetches'

import { SignUp } from './'

jest.mock('@/state/fetches', () => ({
  signUp: jest.fn()
}))

describe('SignUp page', () => {
  afterEach(cleanup)
  test('smoke', () => {
    const { getByLabelText, getByText } = render(<SignUp />)

    expect(getByLabelText(/email/i)).toBeInTheDocument()
    expect(getByLabelText(/username/i)).toBeInTheDocument()
    expect(getByLabelText(/password/i)).toBeInTheDocument()
    expect(getByText(/sign up/i)).toBeInTheDocument()
  })

  describe('a successful signup', () => {
    it('the form should be free of errors and the user should be authenticated at the end of it', () => {
      const { getByTestId, getByLabelText, getByText } = render(<SignUp />)

      const usernameVal = 'chrstntdd'
      const emailVal = 'chrstntdd@gmail.com'
      const passwordVal = 'password'

      const username = getByLabelText(/username/i)
      const email = getByLabelText(/email/i)
      const password = getByLabelText(/password/i)
      const submitButton = getByTestId('signUp-button')

      fireEvent.change(username, {
        target: { value: usernameVal }
      })

      expect(submitButton).toBeDisabled()

      fireEvent.change(email, {
        target: { value: emailVal }
      })

      expect(submitButton).toBeDisabled()

      fireEvent.change(password, {
        target: { value: passwordVal }
      })

      expect(submitButton).not.toBeDisabled()

      fireEvent.click(submitButton)

      expect(signUp).toHaveBeenCalledTimes(1)
      expect(signUp).toHaveBeenCalledWith({
        username: usernameVal,
        password: passwordVal,
        email: emailVal
      })
    })
  })
})
