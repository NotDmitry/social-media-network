import { createContext } from 'react';
import type { SignInPayload, SignUpPayload } from './types';
import type { UserModel } from '@entities/User/types';

interface AuthContextData {
  currentUser: UserModel | null;
  isUserAuthenticated: boolean;
  signIn: (user: SignInPayload) => void;
  signUp: (user: SignUpPayload) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
