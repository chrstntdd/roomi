import React from 'react';
import { Link } from '@chrstntdd/router';

import { signIn } from '@/state/fetches';

import Input from '@/ui/components/Input';
import { SubmitButton } from '@/ui/components/SubmitButton';
import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';

import { useToggle, useForm } from '@/hooks';

import { notEmpty, validateSignInForm } from '@/ui/pages/helpers';

import '../Auth.scss';

export let SignIn = props => {
  let [on, setToggle] = useToggle(true);
  let [formState, setFormState] = useForm();

  let handleSubmit = async ({ username, password }) => {
    await signIn({ username, password });

    props.navigate('/dashboard');
  };

  return (
    <main>
      <div className="kinda-center">
        <form onSubmit={e => e.preventDefault() || handleSubmit(formState)}>
          <div className="form-container">
            <div className="auth-toggle">
              <Link className="choice active" to="/sign-in">
                Sign In
              </Link>
              <Link className="choice" to="/sign-up">
                Sign Up
              </Link>
            </div>

            <legend className="legend">Sign in to your account</legend>
            <Input
              label="Username"
              id="username"
              validator={notEmpty('username')}
              {...setFormState('username')}
            />

            <div className="password-input-container">
              <Input
                label="Password"
                id="password"
                validator={notEmpty('password')}
                type={on ? 'password' : 'text'}
                {...setFormState('password')}
              />
              <button
                type="button"
                data-testid="password-vis-toggle"
                className="visibility-toggle"
                onClick={() => setToggle()}
              >
                {on ? <ShowPasswordIcon /> : <HidePasswordIcon />}
              </button>
            </div>

            <SubmitButton
              data-testid="signIn-button"
              className="searchButton"
              disabled={validateSignInForm(formState).matchWith({
                Success: _ => false,
                Failure: _ => true
              })}
            >
              Sign In
            </SubmitButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
