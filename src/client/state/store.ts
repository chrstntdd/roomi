import createStore from 'unistore';
import devtools from 'unistore/devtools';

import fetches from './fetches';

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
  ...fetches(store)
});

export { store, actions };
