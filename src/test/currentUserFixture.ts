import type { CurrentUserView } from '@/entities/User/types';

export const currentUser = Object.freeze<CurrentUserView>({
  id: 1,
  username: '@john_doe',
  firstName: 'John',
  secondName: 'Doe',
  displayName: 'John Doe',
  email: 'john_doe@example.com',
  description: null,
  bio: null,
  profileImage: null,
  creationDate: null,
  lastLogin: null,
  modifiedDate: null,
});
