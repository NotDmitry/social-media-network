import { likeStatusSchema } from '@/entities/Like/schema';
import type { LikeStatus } from '@/entities/Like/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const LIKE_POST_ERROR_MESSAGE = 'Can\'t like the post';

export async function likePost(postId: number): Promise<LikeStatus> {
  return protectedApiRequest(
    '/api/like',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    },
    {
      responseValidationSchema: likeStatusSchema,
      fallbackErrorMessage: LIKE_POST_ERROR_MESSAGE,
    }
  );
}
