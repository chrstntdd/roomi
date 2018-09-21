import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import { actions } from '@/state/store';
import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';
import Input from '@/ui/components/Input';

import '../Auth.scss';

interface PSignIn {}
interface SSignIn {}

export class SignIn extends Component<PSignIn, SSignIn> {
  state = {};

  handleSubmit = async formValues => {
    await this.props.signIn(formValues);
  };

  render() {
    return (
      <main>
        <Form>
          {({ input, values }) => (
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
                  Sign In
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
)(SignIn);
