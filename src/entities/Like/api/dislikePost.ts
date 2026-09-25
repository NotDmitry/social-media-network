import { likeStatusSchema } from '@/entities/Like/schema';
import type { LikeStatus } from '@/entities/Like/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const DISLIKE_POST_ERROR_MESSAGE = 'Can\'t unlike the post';

export async function dislikePost(postId: number): Promise<LikeStatus> {
  return protectedApiRequest(
    '/api/dislike',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    },
    {
      responseValidationSchema: likeStatusSchema,
      fallbackErrorMessage: DISLIKE_POST_ERROR_MESSAGE,
    }
  );
}
