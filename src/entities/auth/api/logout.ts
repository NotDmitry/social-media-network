import { logoutResponseSchema } from '@/entities/auth/schema';
import type { LogoutResponsePayload } from '@/entities/auth/types';
import { accessToken } from '@/shared/api/accessToken';

const LOGOUT_ERROR_MESSAGE = 'Logout unavailable';

export async function logout(): Promise<LogoutResponsePayload> {
  const availableAccessToken = accessToken.get();
  let response: Response;

  try {
    response = await fetch('/api/logout', {
      method: 'POST',
      headers: availableAccessToken ? { Authorization: `Bearer ${availableAccessToken}` } : undefined,
      credentials: 'include',
    });
  } catch (error) {
    throw new Error(`Cannot connect to the server`, {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new Error(LOGOUT_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Unable to parse the response body');
  }

  const parsedLogoutResponseBody = logoutResponseSchema.safeParse(responseBody);

  if (!parsedLogoutResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedLogoutResponseBody.data;
}
