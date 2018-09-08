import Cmd from '@/cmd';

export default store => ({
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
    } catch ({ message }) {
      store.setState({
        graphQlErrorMsg: message
      });
    }

    store.setState({
      jwt: response[mutationName].token
    });
  }
});
