import fetch from 'unfetch';

import { GRAPHQL_API_ENDPOINT } from '@/constants';

export class Cmd {
  constructor() {
    this.graphQlEndpoint = GRAPHQL_API_ENDPOINT;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  headers: GenericObject;
  graphQlEndpoint: string;

  private async checkGraphQlResponse(response) {
    const { errors, data } = await response.json();

    if (response.ok && data) return Promise.resolve(data);
    else {
      return Promise.reject(Error(errors[0].message));
    }
  }

  private buildGraphQlPayload(gqlString: string, withAuth?: boolean) {
    const token = withAuth && window.sessionStorage && sessionStorage.getItem('jwt');

    return {
      method: 'post',
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...this.headers
      },
      body: JSON.stringify({ query: `mutation ${gqlString}` })
    };
  }

  public async mutation(gqlString: string, withAuth?: boolean) {
    try {
      const response = await fetch(
        this.graphQlEndpoint,
        // @ts-ignore
        this.buildGraphQlPayload(gqlString, withAuth)
      );
      return await this.checkGraphQlResponse(response);
    } catch (error) {
      return error;
    }
  }
}

export default new Cmd();
