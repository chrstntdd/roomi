import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { actions } from '@/state/store';
import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';
import Input from '@/ui/components/Input';
import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';

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
)((props: PSignIn) => <SignIn {...props} />);
