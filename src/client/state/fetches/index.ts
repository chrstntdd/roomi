import Cmd from '@/cmd';

export default store => ({
  signUp: async (state, { email, username, password }) => {
    const mutationName = 'signUp';
    const response = await Cmd.mutation(`${mutationName} {
          ${mutationName}(email: "${email}", username: "${username}", password: "${password}") {
            token
          }
        }
        `);

    response.run().listen({
      onResolved: d => {
        store.setState({
          jwt: d[mutationName].token
        });
      },
      onRejected: ({ message }) => {
        store.setState({
          graphQlErrorMsg: message
        });
      }
    });
  }
});
