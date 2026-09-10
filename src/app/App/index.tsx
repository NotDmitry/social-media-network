import AppRouter from '@/app/AppRouter';
import ThemeContextProvider from '@/features/theme/ThemeContextProvider';
import AuthContextProvider from '@/entities/auth/AuthContextProvider';

function App() {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <AppRouter />
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default App;
