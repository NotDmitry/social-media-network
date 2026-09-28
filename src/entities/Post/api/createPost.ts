import { postModelSchema } from '@/entities/Post/schema';
import type { PostCreationPayload, PostModel } from '@/entities/Post/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const CREATE_POST_ERROR_MESSAGE = 'Post creation unavailable';

export async function createPost(postCreationPayload: PostCreationPayload): Promise<PostModel> {
  return protectedApiRequest(
    '/api/posts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postCreationPayload),
    },
    {
      responseValidationSchema: postModelSchema,
      fallbackErrorMessage: CREATE_POST_ERROR_MESSAGE,
    }
  );
}
