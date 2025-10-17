import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const getGraphQLUrl = () => {
  if (process.env.EXPO_PUBLIC_GRAPHQL_API_URL) {
    return process.env.EXPO_PUBLIC_GRAPHQL_API_URL;
  }
  
  console.warn('EXPO_PUBLIC_GRAPHQL_API_URL not set, using default');
  return 'http://localhost:5000/graphql';
};

const httpLink = createHttpLink({
  uri: getGraphQLUrl(),
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
