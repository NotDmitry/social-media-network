import { z } from 'zod';
import { emailSchema, descriptionSchema, usernameSchema, } from '@/shared/schemas';

export const updateProfileFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  description: descriptionSchema.max(200, 'Reached 200 characters limit'),
});

export type UpdateProfileFormFields = z.input<typeof updateProfileFormSchema>;
