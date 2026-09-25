import { suggestedUsersSchema } from '@/entities/User/schema';
import type { SuggestedUserModel } from '@/entities/User/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const GET_SUGGESTED_USERS_ERROR_MESSAGE = 'Can\'t get suggested users';

export async function getSuggestedUsers(signal?: AbortSignal): Promise<SuggestedUserModel[]> {
  return protectedApiRequest(
    '/api/getSuggested',
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: suggestedUsersSchema,
      fallbackErrorMessage: GET_SUGGESTED_USERS_ERROR_MESSAGE,
    }
  );
}
