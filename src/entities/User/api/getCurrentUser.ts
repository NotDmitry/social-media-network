import { userModelSchema } from '@/entities/User/schema';
import type { UserModel } from '@/entities/User/types';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const GET_CURRENT_USER_ERROR_MESSAGE = 'Can\'t get current user';

export async function getCurrentUser(signal?: AbortSignal): Promise<UserModel> {
  const availableAccessToken = accessToken.get();

  if (availableAccessToken === null) {
    throw new Error('Access token is missing');
  }

  let response: Response;

  try {
    response = await fetch('/api/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${availableAccessToken}`
      },
      signal,
    });
  } catch (error) {
    throw new Error(`Cannot connect to the server`, {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, GET_CURRENT_USER_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Unable to parse the response body');
  }

  const parsedGetUserResponseBody = userModelSchema.safeParse(responseBody);

  if (!parsedGetUserResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedGetUserResponseBody.data;
}
