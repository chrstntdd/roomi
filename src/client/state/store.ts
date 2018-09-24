import createStore, { Store } from 'unistore';
import devtools from 'unistore/devtools';

import fetches, { Fetches } from './fetches';
import syncActions, { Sync } from './actions';

export type RootState = {
  readonly email: string;
  readonly firstName: string;
  readonly friends: any[];
  readonly graphQlErrorMsg: string;
  readonly isAuthenticated: boolean;
  readonly jwt: string;
  readonly lastName: string;
  readonly lists: any[];
  readonly role: string;
  readonly windowWidth: number;
};

const initialState: RootState = {
  email: '',
  firstName: '',
  friends: [],
  graphQlErrorMsg: '',
  isAuthenticated: false,
  jwt: '',
  lastName: '',
  lists: [],
  role: '',
  windowWidth: (window && window.document && document.documentElement.clientWidth) || 0
};

type GlobalStore = Store<RootState>;

/**
 * @description
 * Provides a union of all `Msg`s that can be called within the global context
 */
type Action = Sync | Fetches;

const store: GlobalStore =
  process.env.NODE_ENV === 'development'
    ? devtools(createStore(initialState))
    : createStore(initialState);

const actions = (store: GlobalStore): Action => ({
  ...fetches(store),
  ...syncActions(store)
});

export { store, actions, initialState, GlobalStore };
