import { commentsSchema } from '@/entities/Comment/schema';
import type { CommentModel } from '@/entities/Comment/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const GET_POST_COMMENTS_ERROR_MESSAGE = 'Can\'t fetch comments for the post';

export async function getPostComments(postId: number, signal?: AbortSignal): Promise<CommentModel[]> {
  return protectedApiRequest(
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
