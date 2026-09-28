import { loginResponseSchema } from '@/entities/auth/schema';
import type { LoginResponsePayload, SignInPayload } from '@/entities/auth/types';
import { apiRequest } from '@/shared/api/apiRequest';

const LOGIN_ERROR_MESSAGE = 'Sign in unavailable';

export async function login(signInPayload: SignInPayload): Promise<LoginResponsePayload> {
  return apiRequest(
    '/api/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(signInPayload),
    },
    {
      responseValidationSchema: loginResponseSchema,
      fallbackErrorMessage: LOGIN_ERROR_MESSAGE,
    }
  );
}
