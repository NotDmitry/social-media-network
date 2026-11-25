import { updateEmailResponseSchema } from '@/entities/auth/schema';
import type { UpdateEmailPayload, UpdateEmailResponsePayload } from '@/entities/auth/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const UPDATE_EMAIL_ERROR_MESSAGE = 'Email update unavailable';

export async function updateEmail(updateEmailPayload: UpdateEmailPayload): Promise<UpdateEmailResponsePayload> {
  return protectedApiRequest(
    '/api/account',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateEmailPayload),
    },
    {
      responseValidationSchema: updateEmailResponseSchema,
      fallbackErrorMessage: UPDATE_EMAIL_ERROR_MESSAGE,
    }
  );
}
