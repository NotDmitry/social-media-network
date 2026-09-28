import { z } from 'zod';
import { suggestedUserModelSchema, userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;
export type SuggestedUserModel = z.output<typeof suggestedUserModelSchema>;

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
