import { userModelSchema } from '@/entities/User/schema';
import type { UserModel } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { apiRequest } from '@/shared/api/apiRequest';

const GET_CURRENT_USER_ERROR_MESSAGE = 'Can\'t get current user';

export async function getCurrentUser(signal?: AbortSignal): Promise<UserModel> {
  const availableAccessToken = accessToken.get();

  if (availableAccessToken === null) {
    throw new Error('Access token is missing');
  }

  return apiRequest(
    '/api/me',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${availableAccessToken}`,
      },
      signal,
    },
    {
      responseValidationSchema: userModelSchema,
      fallbackErrorMessage: GET_CURRENT_USER_ERROR_MESSAGE,
    }
  );
}
