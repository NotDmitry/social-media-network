import { logoutResponseSchema } from '@/entities/auth/schema';
import type { LogoutResponsePayload } from '@/entities/auth/types';
import { accessToken } from '@/shared/api/accessToken';
import { apiRequest } from '@/shared/api/apiRequest';

const LOGOUT_ERROR_MESSAGE = 'Logout unavailable';

export async function logout(): Promise<LogoutResponsePayload> {
  const availableAccessToken = accessToken.get();

  return apiRequest(
    '/api/logout',
    {
      method: 'POST',
      headers: availableAccessToken ? { Authorization: `Bearer ${availableAccessToken}` } : undefined,
      credentials: 'include',
    },
    {
      responseValidationSchema: logoutResponseSchema,
      fallbackErrorMessage: LOGOUT_ERROR_MESSAGE,
    }
  );
}
