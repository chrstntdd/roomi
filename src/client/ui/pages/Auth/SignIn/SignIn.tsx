import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { actions } from '@/state/store';
import { SignInMutation } from '@/state/fetches';

import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';
import Input from '@/ui/components/Input';
import { SubmitButton } from '@/ui/components/SubmitButton';
import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';

import { notEmpty, validateSignInForm } from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

interface PSignIn {
  signIn: (validData: SignInMutation) => void;
}
interface SSignIn {}

export class SignIn extends Component<PSignIn, SSignIn> {
  constructor(props) {
    super(props);
  }

  handleSubmit = async ({ username, password }) => {
    await this.props.signIn({ username, password });
  };

  render() {
    return (
      <main>
        <div className="kinda-center">
          <Form>
            {({ input, values }) => (
              // @ts-ignore
              <form onSubmit={e => e.preventDefault() || this.handleSubmit(values)}>
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
                    {...input('username').connect}
                  />
                  <Toggle initial={true}>
                    {({ on, toggle }) => (
                      <div className="password-input-container">
                        <Input
                          label="Password"
                          id="password"
                          validator={notEmpty('password')}
                          type={on ? 'password' : 'text'}
                          {...input('password').connect}
                        />
                        <button
                          data-testid="password-vis-toggle"
                          className="visibility-toggle"
                          onClick={toggle}
                        >
                          {on ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                        </button>
                      </div>
                    )}
                  </Toggle>

                  <SubmitButton
                    data-testid="signIn-button"
                    className="searchButton"
                    disabled={validateSignInForm(values).matchWith({
                      Success: _ => false,
                      Failure: _ => true
                    })}
                  >
                    Sign In
                  </SubmitButton>
                </div>
              </form>
            )}
          </Form>
        </div>
      </main>
    );
  }
}

export default connect(
  'jwt',
  actions
  // @ts-ignore
)(SignIn);
