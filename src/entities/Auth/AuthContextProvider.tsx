import { AuthContext } from './context';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext value={null}>
      {children}
    </AuthContext>
  );
}

export default AuthContextProvider;
