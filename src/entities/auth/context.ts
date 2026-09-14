import { createContext } from 'react';
import type { UserView } from '@/entities/User/types';
import type { LogoutResponsePayload } from '@/entities/auth/api/logout';
import type { AuthState, SignInPayload, SignUpPayload, UpdateProfilePayload } from './types';

interface AuthContextData {
  authStatus: AuthState['status'];
  currentUser: UserView | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => Promise<void>;
  signUp: (signUpPayload: SignUpPayload) => void;
  signOut: () => Promise<LogoutResponsePayload>;
  updateProfile: (UpdateProfilePayload: UpdateProfilePayload) => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
