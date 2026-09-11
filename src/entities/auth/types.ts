import type { UserModel } from "@/entities/User/types";

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
