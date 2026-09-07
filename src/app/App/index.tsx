import AppRouter from '@app/AppRouter';
import AuthContextProvider from '@entities/auth/AuthContextProvider';
import ThemeContextProvider from '@features/theme/ThemeContextProvider';

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
