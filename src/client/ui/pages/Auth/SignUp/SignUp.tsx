import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';
import { SubmitButton } from '@/ui/components/SubmitButton';

import { actions, Action } from '@/state/store';
import { isUsernameAvailable } from '@/state/fetches';

import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import Input from '@/ui/components/Input';

import {
  validateSignUpForm,
  isValidEmail,
  isValidPassword,
  notEmpty
} from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

type PSignUp = {} & Action;

type SSignUp = {
  validationMessages?: string;
  formItems: string[];
};

export class SignUp extends Component<PSignUp, SSignUp> {
  constructor(props) {
    super(props);
  }

  handleSubmit = async ({ username, email, password }) => {
    // @ts-ignore first arg is supplied by unistore
    await this.props.signUp({ username, email, password });
  };

  emailInputId = 'email';
  usernameInputId = 'username';
  passwordInputId = 'password';

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
                    id={this.emailInputId}
                    {...input(this.emailInputId).connect}
                  />
                  <Input
                    label="Username"
                    validator={notEmpty('username')}
                    asyncValidator={() => [isUsernameAvailable(values.username || '')]}
                    id={this.usernameInputId}
                    {...input(this.usernameInputId).connect}
                  />
                  <Toggle initial={true}>
                    {({ on, toggle }) => (
                      <div className="password-input-container">
                        <Input
                          label="Password"
                          validator={isValidPassword}
                          id={this.passwordInputId}
                          type={on ? 'password' : 'text'}
                          {...input(this.passwordInputId).connect}
                        />
                        <button className="visibility-toggle" onClick={toggle}>
                          {on ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                        </button>
                      </div>
                    )}
                  </Toggle>
                  <SubmitButton
                    data-testid="signUp-button"
                    disabled={validateSignUpForm(values).matchWith({
                      Success: _ => false,
                      Failure: _ => true
                    })}
                    className="searchButton"
                  >
                    Sign Up
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
)(SignUp);
