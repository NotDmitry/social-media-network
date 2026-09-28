import { userModelSchema } from '@/entities/User/schema';
import type { UserModel, UpdateProfilePayload } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const UPDATE_PROFILE_ERROR_MESSAGE = 'Profile update unavailable';

export async function updateProfile(updateProfilePayload: UpdateProfilePayload): Promise<UserModel> {
  const availableAccessToken = accessToken.get();

  if (availableAccessToken === null) {
    throw new Error('Access token is missing');
  }

  let response: Response;

  try {
    response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${availableAccessToken}`
      },
      body: JSON.stringify(updateProfilePayload),
    });
  } catch (error) {
    throw new Error('Cannot connect to the server', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, UPDATE_PROFILE_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch (error) {
    throw new Error('Unable to parse the response body', {
      cause: error,
    });
  }

  const parsedUpdateProfileResponseBody = userModelSchema.safeParse(responseBody);

  if (!parsedUpdateProfileResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedUpdateProfileResponseBody.data;
}
