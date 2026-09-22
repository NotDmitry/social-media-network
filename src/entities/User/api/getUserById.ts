import { userModelSchema } from '@/entities/User/schema';
import type { UserModel } from '@/entities/User/types';
import { apiRequest } from '@/shared/api/apiRequest';

const GET_USER_BY_ID_ERROR_MESSAGE = 'Can\'t get the specified user';

export async function getUserById(userId: number): Promise<UserModel> {
  return apiRequest(
    `/api/users/${String(userId)}`,
    {
      method: 'GET',
    },
    {
      responseValidationSchema: userModelSchema,
      fallbackErrorMessage: GET_USER_BY_ID_ERROR_MESSAGE,
    }
  );
}
