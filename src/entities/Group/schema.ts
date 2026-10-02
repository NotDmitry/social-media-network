import { z } from 'zod';
import { idSchema, imageUrlSchema } from '@/shared/schemas';

export const groupModelSchema = z.object({
  id: idSchema,
  title: z.string().nonempty(),
  photo: imageUrlSchema.nullable(),
  membersCount: z.int().nonnegative(),
  ownerId: idSchema.nullable(),
});

export const groupsSchema = z.array(groupModelSchema);
