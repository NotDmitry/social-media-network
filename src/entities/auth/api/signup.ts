import { signUpResponseSchema } from '@/entities/auth/schema';
import type { SignUpPayload, SignUpResponsePayload } from '@/entities/auth/types';
import { BackendResponseError } from '@/shared/api/backendResponseError';

const SIGNUP_ERROR_MESSAGE = 'Sign up unavailable';

export async function signup(signUpPayload: SignUpPayload): Promise<SignUpResponsePayload> {
  let response: Response;

  try {
    response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpPayload),
    });
  } catch (error) {
    throw new Error(`Cannot connect to the server`, {
      cause: error,
    });
  }

  if (!response.ok) {
    throw await BackendResponseError.parse(response, SIGNUP_ERROR_MESSAGE);
  }

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error('Unable to parse the response body');
  }

  const parsedSignUpResponseBody = signUpResponseSchema.safeParse(responseBody);

  if (!parsedSignUpResponseBody.success) {
    throw new Error('Response body is malformed');
  }

  return parsedSignUpResponseBody.data;
}
