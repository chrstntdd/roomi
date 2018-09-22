import createStore, { Store } from 'unistore';
import devtools from 'unistore/devtools';

import fetches from './fetches';

const initialState: RootState = {
  email: '',
  firstName: '',
  friends: [],
  graphQlErrorMsg: '',
  isAuthenticated: false,
  jwt: '',
  lastName: '',
  lists: [],
  role: ''
};

const store: Store<RootState> =
  process.env.NODE_ENV === 'development'
    ? devtools(createStore(initialState))
    : createStore(initialState);

const actions = (store: Store<RootState>) => ({
  ...fetches(store)
});

export { store, actions };
