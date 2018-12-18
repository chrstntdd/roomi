import fetch from 'unfetch'

import { GRAPHQL_API_ENDPOINT } from '@/constants'

type GraphQLRequestType = 'Query' | 'Mutation'

export class Cmd {
  constructor() {
    this.graphQlEndpoint = GRAPHQL_API_ENDPOINT
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  headers: GenericObject
  graphQlEndpoint: string

  private async checkGraphQlResponse(response) {
    const { errors, data } = await response.json()

    if (errors && errors.length) return Promise.reject(Error(errors[0].message))

    if (response.ok && data) return Promise.resolve(data)
  }

  private buildGraphQlPayload(type: GraphQLRequestType, gqlString: string, withAuth?: boolean) {
    const token = withAuth && window.sessionStorage && sessionStorage.getItem('jwt')

    return {
      method: 'post',
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...this.headers
      },
      body: JSON.stringify({ query: `${type === 'Mutation' ? 'mutation' : ''} ${gqlString}` })
    }
  }

  public async mutation(gqlString: string, withAuth?: boolean) {
    try {
      const response = await fetch(
        this.graphQlEndpoint,
        // @ts-ignore
        this.buildGraphQlPayload('Mutation', gqlString, withAuth)
      )
      return this.checkGraphQlResponse(response)
    } catch (error) {
      return error
    }
  }

  public async query(gqlString: string, withAuth?: boolean) {
    try {
      const response = await fetch(
        this.graphQlEndpoint,
        // @ts-ignore
        this.buildGraphQlPayload('Query', gqlString, withAuth)
      )
      return this.checkGraphQlResponse(response)
    } catch (error) {
      return error
    }
  }
}

export default new Cmd()
