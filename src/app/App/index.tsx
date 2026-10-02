import { ApolloProvider } from '@apollo/client/react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apolloClient } from '@/app/apolloClient';
import AppInitializer from '@/app/AppInitializer';
import AppRouter from '@/app/AppRouter';
import { muiGlobalTheme } from '@/app/muiThemeConfig';
import AlertStack from '@/shared/ui/Alert/AlertStack';

const ALERT_DURATION_MS = 5000;
const QUERY_STALE_CACHE_TIME = 20 * 1000; // 20s

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_CACHE_TIME,
      retry: false,
    }
  }
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiGlobalTheme}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <AppInitializer />
            <AlertStack duration={ALERT_DURATION_MS} />
            <AppRouter />
          </ApolloProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
