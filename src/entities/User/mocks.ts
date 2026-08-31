import userWalter from '@assets/images/test_user_walter.jpg';
import userJesse from '@assets/images/test_user_jesse.jpg';
import userGus from '@assets/images/test_user_gus.jpg';
import type { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    fullName: 'Walter White',
    username: 'heisenberg',
    email: 'walter@example.com',
    avatarUrl: userWalter,
    createdAt: '2024-09-21T09:30:00.000Z',
  },
  {
    id: 'user-2',
    fullName: 'Jesse Pinkman',
    username: 'cap_cook',
    email: 'jesse@example.com',
    avatarUrl: userJesse,
    createdAt: '2025-02-15T14:30:00.000Z',
  },
  {
    id: 'user-3',
    fullName: 'Gustavo Fring',
    username: 'chicken_man',
    email: 'gus@example.com',
    avatarUrl: userGus,
    createdAt: '2026-06-13T10:45:00.000Z',
  },
];

export function getAuthUserMock() {
  return MOCK_USERS[0];
}
