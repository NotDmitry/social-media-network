import { commentModelSchema } from '@/entities/Comment/schema';
import type { CommentModel, CommentCreationPayload } from '@/entities/Comment/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const CREATE_COMMENT_ERROR_MESSAGE = 'Comment creation unavailable';

export async function createComment(commentCreationPayload: CommentCreationPayload): Promise<CommentModel> {
  return protectedApiRequest(
    '/api/comments',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentCreationPayload),
    },
    {
      responseValidationSchema: commentModelSchema,
      fallbackErrorMessage: CREATE_COMMENT_ERROR_MESSAGE,
    }
  );
}
