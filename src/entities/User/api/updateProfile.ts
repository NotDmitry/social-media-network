import { userModelSchema } from '@/entities/User/schema';
import type { UserModel, UpdateProfilePayload } from '@/entities/User/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const UPDATE_PROFILE_ERROR_MESSAGE = 'Profile update unavailable';

export async function updateProfile(updateProfilePayload: UpdateProfilePayload): Promise<UserModel> {
  return protectedApiRequest(
    '/api/profile',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateProfilePayload),
    },
    {
      responseValidationSchema: userModelSchema,
      fallbackErrorMessage: UPDATE_PROFILE_ERROR_MESSAGE,
    }
  );
}
