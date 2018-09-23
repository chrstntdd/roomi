import React, { Component } from 'react';
import { Trail, animated } from 'react-spring';
import { connect } from 'unistore/react';

import { Link } from 'packages/Router';
import Form from 'packages/unrender/Form';
import Toggle from 'packages/unrender/Toggle';

import { actions } from '@/state/store';
import { SignInMutation } from '@/state/fetches';

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

  state = {
    formItems: ['legend', 'username', 'password', 'button']
  };

  handleSubmit = async ({ username, password }) => {
    await this.props.signIn({ username, password });
  };

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
                    <Link className="choice active" to="/sign-in">
                      Sign In
                    </Link>
                    <Link className="choice" to="/sign-up">
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
                            <legend className="legend">Sign in to your account</legend>
                          </animated.div>
                        );
                      }
                      if (index === 1) {
                        return (
                          <animated.div style={sharedStyles}>
                            <Input label="Username" id="username" {...input('username').connect} />
                          </animated.div>
                        );
                      }

                      if (index === 2) {
                        return (
                          <animated.div style={sharedStyles}>
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
                          </animated.div>
                        );
                      }

                      if (index === 3) {
                        return (
                          <animated.div style={sharedStyles}>
                            <button className="searchButton" type="submit">
                              Sign In
                            </button>
                          </animated.div>
                        );
                      }
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
)((props: PSignIn) => <SignIn {...props} />);
