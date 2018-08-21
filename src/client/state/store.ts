import createStore from 'unistore';
import devtools from 'unistore/devtools';

import { post } from 'packages/cmd';
import { GRAPHQL_API_ENDPOINT } from '@/constants';

const initialState = {
  email: '',
  firstName: '',
  isAuthenticated: false,
  jwt: '',
  lastName: '',
  role: '',
  friends: [],
  lists: []
};

const store =
  process.env.NODE_ENV === 'development'
    ? devtools(createStore(initialState))
    : createStore(initialState);

const actions = store => ({
  signUp: async (state, { email, username, password }) => {
    const response = await post(GRAPHQL_API_ENDPOINT, {
      query: `
        mutation signUp {
          signUp(email: "${email}", username: "${username}", password: "${password}") {
            token
          }
        }
        `
    });

    response.run().listen({
      onResolved: ({ data }) => {
        store.setState({
          jwt: data.signUp.token
        });
      },
      onRejected: err => {
        console.dir(err);
      }
    });
  }
});

export { store, actions };
