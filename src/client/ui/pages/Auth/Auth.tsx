import React, { Component } from 'react';
import { connect } from 'unistore/react';

import { actions } from '@/state/store';
import Form from 'packages/unrender/Form';
import Input from '@/ui/components/Input';

interface PAuth {
  path: string;
}
interface SAuth {}

export class Auth extends Component<PAuth, SAuth> {
  state = {};

  handleSubmit = formValues => {
    console.log(formValues);
  };

  render() {
    const { path, increment, decrement, count } = this.props;
    const isSignUp = path === '/sign-up';

    return (
      <React.Fragment>
        <button onClick={increment}>inc</button>
        <button onClick={decrement}>dec</button>
        <p>{count}</p>
        <Form>
          {({ input, values }) => (
            <form onSubmit={e => e.preventDefault() || this.handleSubmit(values)}>
              <Input label="Email" id="email" {...input('email').connect} />

              <Input
                label="Password"
                id="password"
                type="password"
                {...input('password').connect}
              />

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
      </React.Fragment>
    );
  }
}

export default connect(
  'count',
  actions
)(Auth);
