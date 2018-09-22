import { Store } from 'unistore';

import Cmd from '@/cmd';

const saveToken = (jwt: string) =>
  window.sessionStorage ? window.sessionStorage.setItem('jwt', jwt) : () => {};

export default (store: Store<RootState>) => ({
  signUp: async (state, { email, username, password }) => {
    const mutationName = 'signUp';
    let response;
    try {
      response = await Cmd.mutation(`${mutationName} {
          ${mutationName}(email: "${email}", username: "${username}", password: "${password}") {
            token
          }
        }
      `);

      const jwt = response[mutationName].token;
      saveToken(jwt);

      store.setState({
        isAuthenticated: true,
        jwt
      });
    } catch ({ message }) {
      store.setState({
        graphQlErrorMsg: message
      });
    }
  },

  signIn: async (state, { username, password }) => {
    const mutationName = 'signIn';
    let response;
    try {
      response = await Cmd.mutation(`${mutationName} {
          ${mutationName}(username: "${username}", password: "${password}") {
            token
          }
        }
        `);

      const jwt = response[mutationName].token;
      saveToken(jwt);

      store.setState({
        isAuthenticated: true,
        jwt: response[mutationName].token
      });
    } catch ({ message }) {
      store.setState({
        graphQlErrorMsg: message
      });
    }
  }
});
