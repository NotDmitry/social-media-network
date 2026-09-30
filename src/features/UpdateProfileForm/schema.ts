import i18next from 'i18next';
import { z } from 'zod';
import { emailSchema, descriptionSchema, usernameSchema, } from '@/shared/schemas';

export const updateProfileFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  description: descriptionSchema.max(200, {
    error: () => i18next.t(($) => $.update.input.description.validation.maxLength, { ns: 'profile' }),
  }),
});

export type UpdateProfileFormFields = z.input<typeof updateProfileFormSchema>;
