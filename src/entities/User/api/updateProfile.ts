import { userModelSchema } from '@/entities/User/schema';
import type { UserModel, UpdateProfilePayload } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { apiRequest } from '@/shared/api/apiRequest';

const UPDATE_PROFILE_ERROR_MESSAGE = 'Profile update unavailable';

export async function updateProfile(updateProfilePayload: UpdateProfilePayload): Promise<UserModel> {
  const availableAccessToken = accessToken.get();

  if (availableAccessToken === null) {
    throw new Error('Access token is missing');
  }

  return apiRequest(
    '/api/profile',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${availableAccessToken}`
      },
      body: JSON.stringify(updateProfilePayload),
    },
    {
      responseValidationSchema: userModelSchema,
      fallbackErrorMessage: UPDATE_PROFILE_ERROR_MESSAGE,
    }
  );
}
