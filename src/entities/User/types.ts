import { z } from 'zod';
import { userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;

export interface UserView extends UserModel {
  displayName: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
  description?: string;
}
