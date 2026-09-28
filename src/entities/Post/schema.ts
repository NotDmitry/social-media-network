import { z } from 'zod';
import { dateTimeSchema, idSchema, imageUrlSchema } from '@/shared/schemas';

export const postModelSchema = z.object({
  id: idSchema,
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  image: imageUrlSchema.nullable(),
  authorId: idSchema,
  likesCount: z.int().nonnegative(),
  commentsCount: z.int().nonnegative(),
  creationDate: dateTimeSchema,
  modifiedDate: dateTimeSchema,
  authorPhoto: imageUrlSchema.optional(),
});

export const postsPageSchema = z.object({
  items: z.array(postModelSchema),
  total: z.int().nonnegative(),
  limit: z.int().nonnegative().max(100),
  offset: z.int().nonnegative(),
});
