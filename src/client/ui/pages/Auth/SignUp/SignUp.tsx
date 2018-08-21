import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { actions } from '@/state/store';
import { Link } from 'packages/Router';
import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';
import Input from '@/ui/components/Input';

import { validateSignUpForm } from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

interface PSignUp {}
interface SSignUp {}

export class SignUp extends Component<PSignUp, SSignUp> {
  state = {};

  handleSubmit = formValues => {
    validateSignUpForm(formValues).matchWith({
      Success: validFormData => this.props.signUp(validFormData),
      Failure: err => console.error(err)
    });
  };

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
                <Input label="Email" id="email" {...input('email').connect} />

                <Input label="Username" id="username" {...input('username').connect} />

                <Toggle initial={true}>
                  {({ on, toggle }) => (
                    <div className="password-input-container">
                      <Input
                        label="Password"
                        id="password"
                        type={on ? 'password' : 'text'}
                        {...input('password').connect}
                      />
                      <button className="visibility-toggle" onClick={toggle}>
                        {on ? <ShowPasswordIcon /> : <HidePasswordIcon />}
                      </button>
                    </div>
                  )}
                </Toggle>

                <button className="searchButton" type="submit">
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
