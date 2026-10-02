import { commentsSchema } from '@/entities/Comment/schema';
import type { CommentModel } from '@/entities/Comment/types';
import { apiRequest } from '@/shared/api/apiRequest';

const GET_POST_COMMENTS_ERROR_MESSAGE = 'Can\'t fetch comments for the post';

export async function getPostComments(postId: number, signal?: AbortSignal): Promise<CommentModel[]> {
  return apiRequest(
    `/api/posts/${String(postId)}/comments`,
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: commentsSchema,
      fallbackErrorMessage: GET_POST_COMMENTS_ERROR_MESSAGE,
    }
  );
}
