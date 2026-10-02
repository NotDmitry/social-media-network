// import { changeEmailResponseSchema } from '@/entities/auth/schema';
// import type { ChangeEmailPayload, ChangeResponsePayload } from '@/entities/auth/types';
// import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

// const CHANGE_EMAIL_ERROR_MESSAGE = 'Email change not available';

// export async function changeEmail(changeEmailPayload: ChangeEmailPayload): Promise<ChangeResponsePayload> {
//   return protectedApiRequest(
//     '/api/account',
//     {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(changeEmailPayload),
//     },
//     {
//       responseValidationSchema: changeEmailResponseSchema,
//       fallbackErrorMessage: CHANGE_EMAIL_ERROR_MESSAGE,
//     }
//   );
// }
