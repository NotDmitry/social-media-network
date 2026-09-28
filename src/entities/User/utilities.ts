import { userModelSchema } from '@/entities/User/schema';
import type { UserModel, UserView } from '@/entities/User/types';

export function isUserModel(value: unknown): value is UserModel {
  return userModelSchema.validate(value);
}

export function getUserDisplayName(user: Pick<UserModel, 'firstName' | 'secondName' | 'username'>) {
  const displayName = `${user.firstName ?? ''} ${user.secondName ?? ''}`.trim();

  return displayName || user.username;
}

export function toUserView(user: UserModel): UserView {
  return {
    ...user,
    displayName: getUserDisplayName(user),
  }
}
