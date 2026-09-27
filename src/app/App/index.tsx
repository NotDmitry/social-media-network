import { ApolloProvider } from '@apollo/client/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apolloClient } from '@/app/apolloClient';
import AppInitializer from '@/app/AppInitializer';
import AppRouter from '@/app/AppRouter';
import AlertStack from '@/shared/ui/Alert/AlertStack';

const ALERT_DURATION_MS = 5000;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <AppInitializer />
        <AlertStack duration={ALERT_DURATION_MS} />
        <AppRouter />
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default App;
