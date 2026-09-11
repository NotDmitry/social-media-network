import type { UserModel } from '@/entities/User/types';
import type { SignInPayload } from '@/entities/auth/types';
import { loginResponseSchema } from './schemas';

const LOGIN_ERROR_MESSAGE = 'Sign in unavailable';

export interface LoginResponsePayload {
  accessToken: string;
  user: UserModel;
}

export async function login(signInPayload: SignInPayload): Promise<LoginResponsePayload> {
  let response: Response;

  try {
    response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(signInPayload),
    });
  } catch (error) {
    throw new Error(`Cannot connect to the server`, {
      cause: error,
    });
  }

  if (response.status === 401) {
    throw new Error('Incorrect email or password');
  }

  if (!response.ok) {
    throw new Error(LOGIN_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Unable to parse the response body');
  }

  const parsedLoginResponseBody = loginResponseSchema.safeParse(responseBody);

  if (!parsedLoginResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return {
    accessToken: parsedLoginResponseBody.data.token,
    user: parsedLoginResponseBody.data.user,
  }
}
