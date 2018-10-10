import React, { Component } from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup, fireEvent } from 'react-testing-library';

import Form from './';

afterEach(cleanup);

class ControlledInput extends Component {
  state = {
    value: ''
  };
  setInputValue = e => {
    const value = e.target.value;

    this.setState({ value });
  };
  render() {
    return <input value={this.state.value} onChange={this.setInputValue} {...this.props} />;
  }
}

test('child can read the state of the form', () => {
  const { getByText } = render(
    <Form initial={{ username: 'username', email: '1234@gmail.com' }}>
      {({ values }) => (
        <React.Fragment>
          <p>{values.username}</p>
          <p>{values.email}</p>
        </React.Fragment>
      )}
    </Form>
  );

  expect(getByText('username')).toBeInTheDocument();
  expect(getByText('1234@gmail.com')).toBeInTheDocument();
});

test('child input can connect to the form state', () => {
  const { getByValue, getByPlaceholderText } = render(
    <Form initial={{ username: 'username' }}>
      {({ input }) => <ControlledInput placeholder="username" {...input('username').connect} />}
    </Form>
  );

  const input = getByPlaceholderText('username');

  fireEvent.change(input, { target: { value: 'something else' } });

  expect(getByValue('something else')).toBeInTheDocument();
});

test('child input can directly set its value', () => {
  const { getByValue, getByText } = render(
    <Form initial={{ username: 'username' }}>
      {({ input }) => (
        <form onSubmit={_ => input('username').set('not the same username')}>
          <ControlledInput {...input('username').connect} />
          <button type="submit">Submit</button>
        </form>
      )}
    </Form>
  );

  fireEvent.submit(getByText('Submit'));

  expect(getByValue('not the same username')).toBeInTheDocument();
});

test('default arguments work', () => {
  const { getByValue, getByText } = render(
    <Form>
      {({ input }) => (
        <form onSubmit={_ => input('password').set('not the same password')}>
          <ControlledInput {...input('password').connect} />
          <button type="submit">Submit</button>
        </form>
      )}
    </Form>
  );

  fireEvent.submit(getByText('Submit'));

  expect(getByValue('not the same password')).toBeInTheDocument();
});
