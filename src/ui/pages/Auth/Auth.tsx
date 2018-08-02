import React, { Component } from 'react';

import Form from '@/packages/unrender/Form';
import Input from '@/ui/components/Input';

enum AuthForm {
  SignIn,
  SignUp
}

export class Auth extends Component {
  state = {};

  handleSubmit = formValues => {
    console.log(formValues);
  };

  render() {
    const { path } = this.props;
    const isSignUp = path === '/sign-up';

    return (
      <Form>
        {({ input, values }) => (
          <form onSubmit={e => e.preventDefault() || this.handleSubmit(values)}>
            <Input label="Email" id="email" {...input('email').connect} />

            <Input label="Password" id="password" type="password" {...input('password').connect} />

            {isSignUp && (
              <Input
                label="Confirm Password"
                id="confirm-password"
                type="password"
                {...input('confirm-password').connect}
              />
            )}

            <button>Sign {isSignUp ? 'Up' : 'In'}</button>
          </form>
        )}
      </Form>
    );
  }
}

export default Auth;
