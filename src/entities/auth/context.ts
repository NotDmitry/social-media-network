import { createContext } from 'react';
import type { UserView } from '@/entities/User/types';
import type { SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';

interface AuthContextData {
  currentUser: UserView | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => void;
  signUp: (signUpPayload: SignUpPayload) => void;
  signOut: () => void;
  updateProfile: (UpdateProfilePayload: UpdateProfilePayload) => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
