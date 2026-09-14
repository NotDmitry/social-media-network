import { loginResponseSchema } from '@/entities/auth/schema';
import type { LoginResponsePayload, SignInPayload } from '@/entities/auth/types';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const LOGIN_ERROR_MESSAGE = 'Sign in unavailable';

export async function login(signInPayload: SignInPayload): Promise<LoginResponsePayload> {
  let response: Response;

  try {
    response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(signInPayload),
    });
  } catch (error) {
    throw new Error('Cannot connect to the server', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, LOGIN_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch (error) {
    throw new Error('Unable to parse the response body', {
      cause: error,
    });
  }

  const parsedLoginResponseBody = loginResponseSchema.safeParse(responseBody);

  if (!parsedLoginResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedLoginResponseBody.data;
}
