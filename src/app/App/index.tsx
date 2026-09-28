import AppInitializer from '@/app/AppInitializer';
import AppRouter from '@/app/AppRouter';
import ThemeContextProvider from '@/features/theme/ThemeContextProvider';
import AlertContextProvider from '@/shared/ui/Alert/AlertContextProvider';

function App() {
  return (
    <AlertContextProvider>
      <AppInitializer />
      <ThemeContextProvider>
        <AppRouter />
      </ThemeContextProvider>
    </AlertContextProvider>
  );
}

export default App;
