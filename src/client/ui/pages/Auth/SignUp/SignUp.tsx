import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';

import { actions } from '@/state/store';

import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import Input from '@/ui/components/Input';

import { validateSignUpForm, isValidEmail, isValidPassword } from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

interface SignUpMutation {
  email: string;
  username: string;
  password: string;
}

interface PSignUp {
  signUp: (validData: SignUpMutation) => void;
}
interface SSignUp {}

export class SignUp extends Component<PSignUp, SSignUp> {
  state = {};

  handleSubmit = async formValues => {
    await this.props.signUp(formValues);
  };

  handleFailedValidation(err: string) {
    this.setState({ validationMessages: err });
  }

  emailInputId = 'email';
  usernameInputId = 'username';
  passwordInputId = 'password';

  render() {
    return (
      <main>
        <Form>
          {({ input, values }) => (
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

                <button
                  disabled={validateSignUpForm(values).matchWith({
                    Success: x => false,
                    Failure: x => true
                  })}
                  className="searchButton"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </Form>
      </main>
    );
  }
}

export default connect(
  'jwt',
  actions
)(SignUp);
