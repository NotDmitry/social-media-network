import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppInitializer from '@/app/AppInitializer';
import AppRouter from '@/app/AppRouter';
import ThemeContextProvider from '@/features/theme/ThemeContextProvider';
import AlertStack from '@/shared/ui/Alert/AlertStack';

const ALERT_DURATION_MS = 5000;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer />
      <AlertStack duration={ALERT_DURATION_MS} />
      <ThemeContextProvider>
        <AppRouter />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
