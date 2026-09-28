import { userModelSchema } from '@/entities/User/schema';
import type { UserModel } from '@/entities/User/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const GET_CURRENT_USER_ERROR_MESSAGE = 'Can\'t get current user';

export async function getCurrentUser(signal?: AbortSignal): Promise<UserModel> {
  return protectedApiRequest(
    '/api/me',
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: userModelSchema,
      fallbackErrorMessage: GET_CURRENT_USER_ERROR_MESSAGE,
    }
  );
}
