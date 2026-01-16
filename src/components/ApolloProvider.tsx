'use client';

import { ApolloProvider as ApolloProviderClient } from '@apollo/client/react';
import { getApolloClient } from '@/lib/apolloClient';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = getApolloClient();
  return <ApolloProviderClient client={client}>{children}</ApolloProviderClient>;
}

