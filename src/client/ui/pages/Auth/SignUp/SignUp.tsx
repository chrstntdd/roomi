import React from 'react';

import { isUsernameAvailable, signUp } from '@/state/fetches';

import { Link } from 'packages/Router';
import { SubmitButton } from '@/ui/components/SubmitButton';
import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import Input from '@/ui/components/Input';

import { useToggle, useForm } from '@/hooks';

import {
  validateSignUpForm,
  isValidEmail,
  isValidPassword,
  notEmpty
} from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

let emailInputId = 'email';
let usernameInputId = 'username';
let passwordInputId = 'password';

export let SignUp = () => {
  let [on, setToggle] = useToggle(true);
  let [formState, setFormState] = useForm();

  let handleSubmit = async ({ username, email, password }) => {
    await signUp({ username, email, password });
  };

  return (
    <main>
      <div className="kinda-center">
        <form onSubmit={e => e.preventDefault() || handleSubmit(formState)}>
          <div className="form-container">
            <div className="auth-toggle">
              <Link className="choice" to="/sign-in">
                Sign In
              </Link>
              <Link className="choice active" to="/sign-up">
                Sign Up
              </Link>
            </div>

            <legend className="legend">Sign up for an account</legend>
            <Input
              label="Email"
              validator={isValidEmail}
              id={emailInputId}
              {...setFormState(emailInputId).connect}
            />
            <Input
              label="Username"
              validator={notEmpty('username')}
              asyncValidator={() => [isUsernameAvailable(formState.username || '')]}
              id={usernameInputId}
              {...setFormState(usernameInputId).connect}
            />

            <div className="password-input-container">
              <Input
                label="Password"
                validator={isValidPassword}
                id={passwordInputId}
                type={on ? 'password' : 'text'}
                {...setFormState(passwordInputId).connect}
              />
              <button className="visibility-toggle" onClick={() => setToggle()}>
                {on ? <ShowPasswordIcon /> : <HidePasswordIcon />}
              </button>
            </div>

            <SubmitButton
              data-testid="signUp-button"
              disabled={validateSignUpForm(formState).matchWith({
                Success: _ => false,
                Failure: _ => true
              })}
              className="searchButton"
            >
              Sign Up
            </SubmitButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
