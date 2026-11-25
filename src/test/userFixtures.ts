import type { CurrentUserView, PublicUserModel } from '@/entities/User/types';

export const testCurrentPublicUser = Object.freeze<PublicUserModel>({
  id: 1,
  username: '@john_doe',
  firstName: 'John',
  secondName: 'Doe',
  description: null,
  bio: null,
  profileImage: null,
  creationDate: null,
});

export const currentUser = Object.freeze<CurrentUserView>({
  ...testCurrentPublicUser,
  displayName: 'John Doe',
  email: 'john_doe@example.com',
  lastLogin: null,
  modifiedDate: null,
});

export const testOtherPublicUser = Object.freeze<PublicUserModel>({
  id: 2,
  username: '@jane_doe',
  firstName: 'Jane',
  secondName: 'Doe',
  description: null,
  bio: null,
  profileImage: null,
  creationDate: null,
});
