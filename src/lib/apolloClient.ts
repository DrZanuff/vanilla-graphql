'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/api/graphql',
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            products: {
              keyArgs: ['inStock'],
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}

let apolloClient: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (typeof window === 'undefined') {
    return createApolloClient();
  }
  
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  
  return apolloClient;
}

