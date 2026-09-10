import type { UserModel } from '@/entities/User/types';
import userGus from '@/assets/images/test_user_gus.jpg';
import userJesse from '@/assets/images/test_user_jesse.jpg';
import userWalter from '@/assets/images/test_user_walter.jpg';

export const MOCK_USERS: UserModel[] = [
  {
    id: 1,
    username: 'heisenberg',
    email: 'walter@example.com',
    firstName: 'Walter',
    profileImage: userWalter,
    description: null,
    secondName: 'White',
    lastLogin: null,
    creationDate: '2024-09-21T09:30:00.000Z',
    modifiedDate: '2024-09-21T09:30:00.000Z',
  },
  {
    id: 2,
    username: 'cap_cook',
    email: 'jesse@example.com',
    firstName: 'Jesse',
    profileImage: userJesse,
    description: null,
    secondName: 'Pinkman',
    lastLogin: null,
    creationDate: '2025-02-15T14:30:00.000Z',
    modifiedDate: '2025-02-15T14:30:00.000Z',
  },
  {
    id: 3,
    username: 'chicken_man',
    email: 'gus@example.com',
    firstName: 'Gustavo',
    profileImage: userGus,
    description: null,
    secondName: 'Fring',
    lastLogin: null,
    creationDate: '2026-06-13T10:45:00.000Z',
    modifiedDate: '2026-06-13T10:45:00.000Z',
  },
];

export function getAuthUserMock() {
  return MOCK_USERS[0];
}
