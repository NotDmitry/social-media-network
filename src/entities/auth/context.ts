import { createContext } from 'react';
import type { UpdateProfilePayload, UserView } from '@/entities/User/types';
import type {
  AuthState,
  LogoutResponsePayload,
  SignInPayload,
  SignUpPayload,
  SignUpResponsePayload,
} from './types';

interface AuthContextData {
  authStatus: AuthState['status'];
  currentUser: UserView | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => Promise<void>;
  signUp: (signUpPayload: SignUpPayload) => Promise<SignUpResponsePayload>;
  signOut: () => Promise<LogoutResponsePayload>;
  updateProfile: (updateProfilePayload: UpdateProfilePayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | null>(null);
