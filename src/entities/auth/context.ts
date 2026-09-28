import { createContext } from 'react';
import type { UserView } from '@/entities/User/types';
import type {
  AuthState,
  LogoutResponsePayload,
  SignInPayload,
  SignUpPayload,
  SignUpResponsePayload,
  UpdateProfilePayload,
} from './types';

interface AuthContextData {
  authStatus: AuthState['status'];
  currentUser: UserView | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => Promise<void>;
  signUp: (signUpPayload: SignUpPayload) => Promise<SignUpResponsePayload>;
  signOut: () => Promise<LogoutResponsePayload>;
  updateProfile: (updateProfilePayload: UpdateProfilePayload) => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);
