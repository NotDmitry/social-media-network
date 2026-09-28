import AppRouter from '@/app/AppRouter';
import ThemeContextProvider from '@/features/theme/ThemeContextProvider';
import AuthContextProvider from '@/entities/auth/AuthContextProvider';
import AlertContextProvider from '@/shared/ui/Alert/AlertContextProvider';

function App() {
  return (
    <AlertContextProvider>
      <AuthContextProvider>
        <ThemeContextProvider>
          <AppRouter />
        </ThemeContextProvider>
      </AuthContextProvider>
    </AlertContextProvider>
  );
}

export default App;
