import { z } from 'zod';
import { dateTimeSchema, idSchema } from '@/shared/schemas';

export const commentModelSchema = z.object({
  id: idSchema,
  text: z.string().nonempty(),
  authorId: idSchema,
  postId: idSchema,
  creationDate: dateTimeSchema,
  modifiedDate: dateTimeSchema,
});
