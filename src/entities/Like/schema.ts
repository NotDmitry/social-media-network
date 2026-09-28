import { z } from 'zod';
import { dateTimeSchema, idSchema } from '@/shared/schemas';

export const likeModelSchema = z.object({
  id: idSchema,
  postId: idSchema,
  userId: idSchema,
  creationDate: dateTimeSchema,
});

export const likeStatusSchema = z.object({
  status: z.enum(['liked', 'already_liked', 'disliked', 'not_liked']),
  postId: idSchema,
  newLikesCount: z.int().nonnegative(),
});

export const likesSchema = z.array(likeModelSchema);
