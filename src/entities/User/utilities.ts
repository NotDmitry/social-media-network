import { userModelSchema } from '@/entities/User/schema';
import type { UserModel, UserView } from '@/entities/User/types';
import currentUserImage from '@/assets/images/test_user_walter.jpg';
import defaultUserImage from '@/assets/images/default_user.png';
import otherUserImage from '@/assets/images/test_user_hank.jpg';

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

export function getProfileImageFallbackUrl(isCurrentUser: boolean, providedImageUrl?: string | null) {
  if (!providedImageUrl) {
    return defaultUserImage;
  }

  return isCurrentUser ? currentUserImage : otherUserImage;
}
