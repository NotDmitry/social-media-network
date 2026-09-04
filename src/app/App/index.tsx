import AppRouter from '@app/AppRouter';
import AuthContextProvider from '@/entities/auth/AuthContextProvider';

function App() {
  return (
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
  )
}

export default App;
