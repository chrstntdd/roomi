import { post } from 'packages/cmd';
import { GRAPHQL_API_ENDPOINT } from '@/constants';

export default store => ({
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
