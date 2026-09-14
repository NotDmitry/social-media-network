import { z } from 'zod';
import type { UserModel } from "@/entities/User/types";
import { loginResponseSchema, logoutResponseSchema } from './schema';

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

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
  description?: string;
}

export type LoginResponsePayload = z.output<typeof loginResponseSchema>;
export type LogoutResponsePayload = z.output<typeof logoutResponseSchema>;
