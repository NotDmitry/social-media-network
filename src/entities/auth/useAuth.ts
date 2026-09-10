import { useContext } from 'react';
import { AuthContext } from './context'

export function useAuth() {
  const authContextData = useContext(AuthContext);

  if (!authContextData) {
    throw new Error('useAuth hook must be used inside AuthContext provider');
  }

  return authContextData;
}
