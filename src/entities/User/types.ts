import { z } from 'zod';
import { userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;

export function isUserModel(value: unknown): value is UserModel {
  return userModelSchema.validate(value);
}

export function getUserDisplayName(user: UserModel) {
  const fullName = (user.firstName ?? '') + (user.secondName ?? '');

  return fullName || user.username;
}
