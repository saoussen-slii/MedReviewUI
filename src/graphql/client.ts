import { ApolloClient, InMemoryCache } from '@apollo/client'

/** Point this at your GraphQL server that wraps https://jsonplaceholder.typicode.com/ */
export const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})
