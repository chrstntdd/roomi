import { sha256 } from '@/util';
import Cmd from '@/cmd';
import { RootState, GlobalStore } from '@/state/store';

export interface SignInMutation {
  username: string;
  password: string;
}

export interface SignUpMutation {
  email: string;
  username: string;
  password: string;
}

export interface UsernameAvailability {
  username: string;
}

export interface Fetches {
  signUp: (state: RootState, SignUpMutation) => void;
  signIn: (state: RootState, SignInMutation) => void;
}

export interface AsyncValidator {
  isValid: boolean;
  msg?: string;
}

/**
 * @description
 * If the request returns data, there is already an account with
 * the given username.
 */
export const isUsernameAvailable = async (username: string): Promise<AsyncValidator> => {
  const mutationName = 'user';
  try {
    await Cmd.query(`{
      ${mutationName}(username: "${username}") {
        id
      }
    }`);
    return {
      isValid: false,
      msg: `${username} is already in use. Please choose another username.`
    };
  } catch (e) {
    return { isValid: true };
  }
};

const saveToken = (jwt: string) =>
  window.sessionStorage ? window.sessionStorage.setItem('jwt', jwt) : () => {};

export default (store: GlobalStore): Fetches => ({
  signUp: async (_, { email, username, password: plainPassword }) => {
    const password = await sha256(plainPassword);
    const mutationName = 'signUp';
    let response;
    try {
      response = await Cmd.mutation(`${mutationName} {
        ${mutationName}(email: "${email}", username: "${username}", password: "${password}") {
          token
        }
      }`);

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

  signIn: async (_, { username, password: plainPassword }) => {
    const password = await sha256(plainPassword);
    const mutationName = 'signIn';
    let response;
    try {
      response = await Cmd.mutation(`${mutationName} {
        ${mutationName}(username: "${username}", password: "${password}") {
          token
        }
      }`);

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
