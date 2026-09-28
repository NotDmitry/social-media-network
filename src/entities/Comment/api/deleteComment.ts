import { noContentResponseSchema } from '@/shared/schemas';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const DELETE_COMMENT_ERROR_MESSAGE = 'Can\'t delete the comment';

export async function deleteComment(commentId: number): Promise<void> {
  await protectedApiRequest(
    `/api/comments/${String(commentId)}`,
    {
      method: 'DELETE',
    },
    {
      responseValidationSchema: noContentResponseSchema,
      fallbackErrorMessage: DELETE_COMMENT_ERROR_MESSAGE,
    }
  );
}
