import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { authListenerMiddleware } from '@/entities/auth/model/authListener';
import { sessionCleared } from '@/entities/auth/model/authSlice';
// import { protectedGraphqlFetch } from '@/shared/api/protectedGraphqlFetch';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://rickandmortyapi.com/graphql',
    // fetch: protectedGraphqlFetch,
  }),
  cache: new InMemoryCache(),
});

authListenerMiddleware.startListening({
  actionCreator: sessionCleared,
  effect: async () => {
    await apolloClient.clearStore();
  },
});
