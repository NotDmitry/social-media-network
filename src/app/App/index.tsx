import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppInitializer from '@/app/AppInitializer';
import AppRouter from '@/app/AppRouter';
import ThemeContextProvider from '@/features/theme/ThemeContextProvider';
import AlertContextProvider from '@/shared/ui/Alert/AlertContextProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertContextProvider>
        <AppInitializer />
        <ThemeContextProvider>
          <AppRouter />
        </ThemeContextProvider>
      </AlertContextProvider>
    </QueryClientProvider>
  );
}

export default App;
