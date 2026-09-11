import { z } from 'zod';
import { updateProfileSchema } from '@/entities/auth/schema';
import { userDescriptionSchema } from '@/entities/User/schema';

export const updateProfileFormSchema = updateProfileSchema.pick({
  username: true,
  email: true,
  description: true,
}).required().extend({
  description: userDescriptionSchema.max(200, 'Reached 200 characters limit'),
});

export type UpdateProfileFormFields = z.input<typeof updateProfileFormSchema>;
