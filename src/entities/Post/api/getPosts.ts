import { postsPageSchema } from '@/entities/Post/schema';
import type { PostsPage } from '@/entities/Post/types';
import { apiRequest } from '@/shared/api/apiRequest';

const GET_POSTS_ERROR_MESSAGE = 'Unable to fetch Posts';

export async function getPosts(limit: number, offset: number, signal?: AbortSignal): Promise<PostsPage> {
  const urlSearchParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return apiRequest(
    `/api/posts?${urlSearchParams.toString()}`,
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: postsPageSchema,
      fallbackErrorMessage: GET_POSTS_ERROR_MESSAGE,
    }
  );
}
