import React, { Component } from 'react';
import { connect } from 'unistore/react';
import { Trail, animated } from 'react-spring';

import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';

import { actions } from '@/state/store';
import { SignUpMutation } from '@/state/fetches';

import { HidePasswordIcon, ShowPasswordIcon } from '@/ui/icons';
import Input from '@/ui/components/Input';

import { validateSignUpForm, isValidEmail, isValidPassword } from '@/ui/pages/Auth/helpers';

import '../Auth.scss';

interface PSignUp {
  signUp: (validData: SignUpMutation) => void;
}

interface SSignUp {
  validationMessages?: string;
  formItems: string[];
}

export class SignUp extends Component<PSignUp, SSignUp> {
  constructor(props) {
    super(props);
  }

  state = {
    formItems: ['legend', 'email', 'username', 'password', 'button']
  };

  handleSubmit = async ({ username, email, password }) => {
    await this.props.signUp({ username, email, password });
  };

  handleFailedValidation(err: string) {
    this.setState({ validationMessages: err });
  }

  emailInputId = 'email';
  usernameInputId = 'username';
  passwordInputId = 'password';

  render() {
    const { formItems } = this.state;

    return (
      <main>
        <div className="kinda-center">
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

                  <Trail
                    from={{ opacity: 0, y: 100 }}
                    to={{ opacity: 100, y: 0 }}
                    config={{ tension: 160, friction: 10 }}
                    native
                    keys={formItems}
                  >
                    {formItems.map((item, index) => ({ y, opacity }) => {
                      const sharedStyles = {
                        opacity,
                        transform: y.interpolate(y => `translate3d(0,${y}%,0)`)
                      };

                      if (index === 0) {
                        return (
                          <animated.div style={sharedStyles}>
                            <legend className="legend">Sign up for an account</legend>
                          </animated.div>
                        );
                      }
                      if (index === 1) {
                        return (
                          <animated.div style={sharedStyles}>
                            <Input
                              label="Email"
                              validator={isValidEmail}
                              id={this.emailInputId}
                              {...input(this.emailInputId).connect}
                            />
                          </animated.div>
                        );
                      }
                      if (index === 2) {
                        return (
                          <animated.div style={sharedStyles}>
                            <Input
                              label="Username"
                              id={this.usernameInputId}
                              {...input(this.usernameInputId).connect}
                            />
                          </animated.div>
                        );
                      }
                      if (index === 3) {
                        return (
                          <animated.div style={sharedStyles}>
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
                          </animated.div>
                        );
                      }
                      if (index === 4) {
                        return (
                          <animated.div style={sharedStyles}>
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
                          </animated.div>
                        );
                      }

                      return null;
                    })}
                  </Trail>
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
