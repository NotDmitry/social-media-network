import { createContext } from 'react';
import type { SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';
import type { UserModel } from '@entities/User/types';

interface AuthContextData {
  currentUser: UserModel | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => void;
  signUp: (signUpPayload: SignUpPayload) => void;
  signOut: () => void;
  updateProfile: (UpdateProfilePayload: UpdateProfilePayload) => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
