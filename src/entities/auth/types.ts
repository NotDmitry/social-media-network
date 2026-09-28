import { z } from 'zod';
import type { UserModel } from '@/entities/User/types';
import { loginResponseSchema, logoutResponseSchema, refreshResponseSchema, signUpResponseSchema } from './schema';

export type AuthState =
  | {
    status: 'pending';
    currentUser: null;
  }
  | {
    status: 'guest';
    currentUser: null;
  }
  | {
    status: 'authenticated';
    currentUser: UserModel;
  }
  | {
    status: 'unavailable';
    currentUser: null;
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
