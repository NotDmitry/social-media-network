import { signUpResponseSchema } from '@/entities/auth/schema';
import type { SignUpPayload, SignUpResponsePayload } from '@/entities/auth/types';
import { apiRequest } from '@/shared/api/apiRequest';

const SIGNUP_ERROR_MESSAGE = 'Sign up unavailable';

export async function signup(signUpPayload: SignUpPayload): Promise<SignUpResponsePayload> {
  return apiRequest(
    '/api/signup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpPayload),
    },
    {
      responseValidationSchema: signUpResponseSchema,
      fallbackErrorMessage: SIGNUP_ERROR_MESSAGE,
    }
  );
}
