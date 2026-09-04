import { createContext } from 'react';
import type { UserModel } from '@entities/User/types';

interface AuthContextData {
  currentUser: UserModel | null;
  isUserAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData | null>(null);
