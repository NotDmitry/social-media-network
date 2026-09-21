import { z } from 'zod';
import type { UpdateProfilePayload, UserModel, UserView } from '@/entities/User/types';
import { loginResponseSchema, logoutResponseSchema, refreshResponseSchema, signUpResponseSchema } from './schema';

export type AuthStatus = 'pending' | 'guest' | 'authenticated' | 'unavailable';

export interface AuthState {
  status: AuthStatus;
  currentUser: UserModel | null;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  secondName?: string;
}

export type LoginResponsePayload = z.output<typeof loginResponseSchema>;
export type LogoutResponsePayload = z.output<typeof logoutResponseSchema>;
export type SignUpResponsePayload = z.output<typeof signUpResponseSchema>;
export type RefreshResponsePayload = z.output<typeof refreshResponseSchema>;

export interface AuthExposedApi {
  authStatus: AuthStatus;
  currentUser: UserView | null;
  isUserAuthenticated: boolean;
  signIn: (signInPayload: SignInPayload) => Promise<void>;
  signUp: (signUpPayload: SignUpPayload) => Promise<SignUpResponsePayload>;
  signOut: () => Promise<LogoutResponsePayload>;
  updateProfile: (updateProfilePayload: UpdateProfilePayload) => Promise<void>;
}
