import { likesSchema } from '@/entities/Like/schema';
import type { LikeModel } from '@/entities/Like/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const GET_CURRENT_USER_LIKES_ERROR_MESSAGE = 'Can\'t get your likes';

export async function getCurrentUserLikes(signal?: AbortSignal): Promise<LikeModel[]> {
  return protectedApiRequest(
    '/api/me/likes',
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: likesSchema,
      fallbackErrorMessage: GET_CURRENT_USER_LIKES_ERROR_MESSAGE,
    }
  );
}
