import { z } from 'zod';
import { userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;

export interface UserView extends UserModel {
  displayName: string;
}

export function isUserModel(value: unknown): value is UserModel {
  return userModelSchema.validate(value);
}

export function getUserDisplayName(user: UserModel) {
  const displayName = `${user.firstName ?? ''} ${user.secondName ?? ''}`.trim();

  return displayName || user.username;
}

export function toUserView(user: UserModel): UserView {
  return {
    ...user,
    displayName: getUserDisplayName(user),
  }
}
